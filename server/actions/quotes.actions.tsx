"use server";

import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";
import { quoteRequestSchema } from "@/lib/validations/quote.schema";
import { appointmentRateLimiter } from "@/lib/redis";
import { resend, emailFrom } from "@/lib/resend";
import { getAdminNotificationEmails } from "@/lib/admin-auth";
import { STUDIO_CONFIG } from "@/lib/constants/studio";
import { render } from "@react-email/components";
import AdminQuoteRequestEmail from "@/emails/AdminQuoteRequestEmail";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// ── Tipos de retorno ─────────────────────────────────────────
type ActionResult = {
  success: boolean;
  message: string;
  error?: string;
};

/**
 * Server Action pública: Solicitar orçamento de tatuagem.
 * Fluxo:
 * 1. Rate Limit (3 req/10min por IP via Upstash Redis)
 * 2. Validação Zod
 * 3. Insere no banco com status pending_confirmation
 * 4. Dispara e-mail para administradores via Resend
 */
export async function requestQuoteAction(
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
    const parsed = quoteRequestSchema.safeParse(formData);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return {
        success: false,
        message: firstError?.message || "Dados inválidos.",
        error: "VALIDATION_ERROR",
      };
    }

    const data = parsed.data;

    // 3. Persistir no banco de dados Neon (sem slot vinculado)
    await db.insert(appointments).values({
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientWhatsapp: data.clientWhatsapp,
      bodyLocation: data.bodyLocation,
      description: data.description,
      // Campos opcionais que não se aplicam ao pedido de orçamento
      slotId: null,
      tattooStyle: null,
      approxSizeCm: null,
      referenceImageUrl: null,
    });

    // 4. E-mail transacional para admins via Resend
    const adminEmails = getAdminNotificationEmails(STUDIO_CONFIG.email);

    if (adminEmails.length > 0) {
      console.info(
        "[Email] Disparando alerta de novo pedido de orçamento para:",
        adminEmails.join(", ")
      );
      const adminHtml = await render(
        <AdminQuoteRequestEmail
          clientName={data.clientName}
          clientEmail={data.clientEmail}
          clientWhatsapp={data.clientWhatsapp}
          bodyLocation={data.bodyLocation}
          description={data.description}
          adminPanelUrl={`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin`}
        />
      );

      resend.emails
        .send({
          from: emailFrom,
          to: adminEmails,
          subject: `✨ Novo Pedido de Orçamento — ${data.clientName}`,
          html: adminHtml,
        })
        .catch((err) =>
          console.error("[Email] Erro ao enviar para admin:", err)
        );
    }

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      success: true,
      message:
        "Solicitação de orçamento enviada com sucesso! A Russa analisará os detalhes do seu projeto e entrará em contacto direto.",
    };
  } catch (error) {
    console.error("[Action] Erro no pedido de orçamento:", error);
    return {
      success: false,
      message: "Erro interno. Tente novamente mais tarde.",
      error: "INTERNAL_ERROR",
    };
  }
}
