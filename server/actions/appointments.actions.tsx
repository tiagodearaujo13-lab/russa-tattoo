"use server";

import { db } from "@/lib/db";
import { appointments, scheduleSlots } from "@/lib/db/schema";
import { appointmentSchema } from "@/lib/validations/appointment.schema";
import { appointmentRateLimiter } from "@/lib/redis";
import { resend, emailFrom } from "@/lib/resend";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { render } from "@react-email/components";
import ClientConfirmationEmail from "@/emails/ClientConfirmationEmail";
import AdminNewAppointmentEmail from "@/emails/AdminNewAppointmentEmail";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// ── Tipos de retorno ─────────────────────────────────────────
type ActionResult = {
  success: boolean;
  message: string;
  error?: string;
};

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return value.replace(/[&<>\"']/g, (character) => entities[character] ?? character);
}

// ── Ação pública: Solicitar agendamento ──────────────────────
/**
 * Cria uma nova solicitação de agendamento.
 * Fluxo:
 * 1. Rate Limit (3 req/10min por IP via Upstash Redis)
 * 2. Validação Zod
 * 3. Verifica se o slot está disponível
 * 4. Insere no banco + atualiza slot para 'reserved'
 * 5. Dispara e-mails para cliente e admin
 */
export async function requestAppointmentAction(
  formData: unknown
): Promise<ActionResult> {
  try {
    // 1. Rate Limiting
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") ?? "unknown";

    const { success: rateLimitOk } = await appointmentRateLimiter.limit(ip);

    if (!rateLimitOk) {
      return {
        success: false,
        message: "Muitas solicitações. Tente novamente em alguns minutos.",
        error: "RATE_LIMIT_EXCEEDED",
      };
    }

    // 2. Validação Zod
    const parsed = appointmentSchema.safeParse(formData);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return {
        success: false,
        message: firstError?.message || "Dados inválidos.",
        error: "VALIDATION_ERROR",
      };
    }

    const data = parsed.data;

    // 3–4. Reserva o slot e cria o agendamento na mesma transação.
    const { slot } = await db.transaction(async (tx) => {
      const [reservedSlot] = await tx
        .update(scheduleSlots)
        .set({ status: "reserved" })
        .where(
          and(
            eq(scheduleSlots.id, data.slotId),
            eq(scheduleSlots.status, "available")
          )
        )
        .returning();

      if (!reservedSlot) {
        throw new Error("SLOT_UNAVAILABLE");
      }

      await tx.insert(appointments).values({
        slotId: data.slotId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientWhatsapp: data.clientWhatsapp,
        tattooStyle: data.tattooStyle,
        bodyLocation: data.bodyLocation,
        approxSizeCm: data.approxSizeCm,
        description: data.description || null,
        referenceImageUrl: data.referenceImageUrl || null,
      });

      return { slot: reservedSlot };
    });

    // 5. Renderiza os templates React Email depois do commit da transação.
    const adminEmail = process.env.ADMIN_EMAIL;
    const clientHtml = await render(
      <ClientConfirmationEmail
        clientName={data.clientName}
        date={slot.date}
        timeStart={slot.timeStart}
        timeEnd={slot.timeEnd}
        tattooStyle={data.tattooStyle}
        bodyLocation={data.bodyLocation}
        approxSizeCm={data.approxSizeCm}
      />
    );

    resend.emails
      .send({
        from: emailFrom,
        to: data.clientEmail,
        subject: "✨ Russa Tattoo Studio — Solicitação Recebida!",
        html: clientHtml,
      })
      .catch((err) => console.error("[Email] Erro ao enviar para cliente:", err));

    if (adminEmail) {
      const adminHtml = await render(
        <AdminNewAppointmentEmail
          clientName={data.clientName}
          clientEmail={data.clientEmail}
          clientWhatsapp={data.clientWhatsapp}
          date={slot.date}
          timeStart={slot.timeStart}
          timeEnd={slot.timeEnd}
          tattooStyle={data.tattooStyle}
          bodyLocation={data.bodyLocation}
          approxSizeCm={data.approxSizeCm}
          description={data.description}
          referenceImageUrl={data.referenceImageUrl}
          adminPanelUrl={`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin`}
        />
      );

      resend.emails
        .send({
          from: emailFrom,
          to: adminEmail,
          subject: `🔔 Nova Solicitação — ${data.clientName} (${data.tattooStyle})`,
          html: adminHtml,
        })
        .catch((err) => console.error("[Email] Erro ao enviar para admin:", err));
    }

    revalidatePath("/");
    revalidatePath("/api/schedules/public");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Solicitação enviada com sucesso! Entraremos em contacto em breve.",
    };
  } catch (error) {
    if (error instanceof Error && error.message === "SLOT_UNAVAILABLE") {
      return {
        success: false,
        message: "Este horário já não está disponível.",
        error: "SLOT_UNAVAILABLE",
      };
    }

    console.error("[Action] Erro no agendamento:", error);
    return {
      success: false,
      message: "Erro interno. Tente novamente mais tarde.",
      error: "INTERNAL_ERROR",
    };
  }
}

// ── Ação admin: Confirmar agendamento ────────────────────────
export async function confirmAppointmentAction(
  appointmentId: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (
      !session?.user?.email ||
      session.user.email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()
    ) {
      return { success: false, message: "Acesso negado.", error: "FORBIDDEN" };
    }

    const [appointment] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, appointmentId))
      .limit(1);

    if (!appointment) {
      return { success: false, message: "Agendamento não encontrado.", error: "NOT_FOUND" };
    }

    await db
      .update(appointments)
      .set({ status: "confirmed" })
      .where(eq(appointments.id, appointmentId));

    // Notifica o cliente da confirmação
    const [slot] = await db
      .select()
      .from(scheduleSlots)
      .where(eq(scheduleSlots.id, appointment.slotId))
      .limit(1);

    resend.emails
      .send({
        from: emailFrom,
        to: appointment.clientEmail,
        subject: "✅ Russa Tattoo Studio — Agendamento Confirmado!",
        html: `
          <div style="font-family: 'Montserrat', sans-serif; background: #0a0a0a; color: #f5f5f5; padding: 40px; max-width: 600px; margin: 0 auto;">
            <h1 style="font-family: 'Permanent Marker', cursive; color: #d4d4d8; font-size: 28px;">Agendamento Confirmado! ✅</h1>
            <p>Olá <strong>${escapeHtml(appointment.clientName)}</strong>!</p>
            <p>O seu agendamento foi <strong style="color: #d4d4d8;">confirmado</strong> pela Russa.</p>
            ${slot ? `
            <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p><strong>📅 Data:</strong> ${escapeHtml(slot.date)}</p>
              <p><strong>🕐 Horário:</strong> ${escapeHtml(slot.timeStart)} — ${escapeHtml(slot.timeEnd)}</p>
            </div>
            ` : ""}
            <p>Até lá! 🖤</p>
          </div>
        `,
      })
      .catch((err) => console.error("[Email] Erro ao confirmar para cliente:", err));

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/api/schedules/public");

    return { success: true, message: "Agendamento confirmado com sucesso!" };
  } catch (error) {
    console.error("[Action] Erro ao confirmar:", error);
    return { success: false, message: "Erro interno.", error: "INTERNAL_ERROR" };
  }
}

// ── Ação admin: Cancelar agendamento ─────────────────────────
export async function cancelAppointmentAction(
  appointmentId: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (
      !session?.user?.email ||
      session.user.email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()
    ) {
      return { success: false, message: "Acesso negado.", error: "FORBIDDEN" };
    }

    const [appointment] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, appointmentId))
      .limit(1);

    if (!appointment) {
      return { success: false, message: "Agendamento não encontrado.", error: "NOT_FOUND" };
    }

    // Cancela o agendamento
    await db
      .update(appointments)
      .set({ status: "cancelled" })
      .where(eq(appointments.id, appointmentId));

    // Libera o slot de volta para 'available'
    await db
      .update(scheduleSlots)
      .set({ status: "available" })
      .where(eq(scheduleSlots.id, appointment.slotId));

    // Notifica o cliente
    resend.emails
      .send({
        from: emailFrom,
        to: appointment.clientEmail,
        subject: "❌ Russa Tattoo Studio — Agendamento Cancelado",
        html: `
          <div style="font-family: 'Montserrat', sans-serif; background: #0a0a0a; color: #f5f5f5; padding: 40px; max-width: 600px; margin: 0 auto;">
            <h1 style="font-family: 'Permanent Marker', cursive; color: #a1a1aa; font-size: 28px;">Agendamento Cancelado</h1>
            <p>Olá <strong>${escapeHtml(appointment.clientName)}</strong>,</p>
            <p>Lamentamos informar que o seu agendamento foi cancelado.</p>
            <p>Entre em contacto connosco para reagendar:</p>
            <a href="https://wa.me/${escapeHtml(process.env.NEXT_PUBLIC_STUDIO_WHATSAPP || "351912345678")}" style="display: inline-block; background: #ffffff; color: #000000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700;">
              WhatsApp
            </a>
          </div>
        `,
      })
      .catch((err) => console.error("[Email] Erro ao cancelar para cliente:", err));

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/api/schedules/public");

    return { success: true, message: "Agendamento cancelado e horário liberado." };
  } catch (error) {
    console.error("[Action] Erro ao cancelar:", error);
    return { success: false, message: "Erro interno.", error: "INTERNAL_ERROR" };
  }
}
