"use server";

import { db } from "@/lib/db";
import { scheduleSlots } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addDays, format, nextMonday } from "date-fns";

// ── Tipos ────────────────────────────────────────────────────
type ActionResult = {
  success: boolean;
  message: string;
  error?: string;
};

// ── Schemas de validação ─────────────────────────────────────
const createSlotSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (YYYY-MM-DD)."),
  timeStart: z.string().regex(/^\d{2}:\d{2}$/, "Horário de início inválido (HH:MM)."),
  timeEnd: z.string().regex(/^\d{2}:\d{2}$/, "Horário de fim inválido (HH:MM)."),
});

const bulkCreateSchema = z.object({
  dates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).min(1, "Selecione pelo menos uma data."),
  timeStart: z.string().regex(/^\d{2}:\d{2}$/),
  timeEnd: z.string().regex(/^\d{2}:\d{2}$/),
});

// ── Helper: Verificar admin ──────────────────────────────────
async function verifyAdmin(): Promise<void> {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("UNAUTHORIZED");
  }
}

function actionError(error: unknown): ActionResult {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return { success: false, message: "Acesso negado.", error: "UNAUTHORIZED" };
  }
  return { success: false, message: "Erro interno.", error: "INTERNAL_ERROR" };
}

// ── Seed rápido para testes ──────────────────────────────────
export async function seedTestSlotsAction(): Promise<ActionResult> {
  try {
    await verifyAdmin();
    const monday = nextMonday(new Date());
    const dates = [0, 2, 4].map((offset) => format(addDays(monday, offset), "yyyy-MM-dd"));
    await db.insert(scheduleSlots).values(
      dates.map((date) => ({ date, timeStart: "14:00", timeEnd: "15:00", status: "available" as const }))
    );
    revalidatePath("/admin/agenda");
    revalidatePath("/");
    revalidatePath("/api/schedules/public");
    return { success: true, message: "3 horários de teste criados para a próxima semana." };
  } catch (error) {
    console.error("[Action] Erro ao semear slots:", error);
    return actionError(error);
  }
}

// ── Criar um slot ────────────────────────────────────────────
export async function createSlotAction(data: unknown): Promise<ActionResult> {
  try {
    await verifyAdmin();

    const parsed = createSlotSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Dados inválidos.",
        error: "VALIDATION_ERROR",
      };
    }

    await db.insert(scheduleSlots).values({
      date: parsed.data.date,
      timeStart: parsed.data.timeStart,
      timeEnd: parsed.data.timeEnd,
      status: "available",
    });

    revalidatePath("/admin/agenda");
    revalidatePath("/");
    revalidatePath("/api/schedules/public");

    return { success: true, message: "Horário criado com sucesso!" };
  } catch (error) {
    console.error("[Action] Erro ao criar slot:", error);
    return actionError(error);
  }
}

// ── Criar slots em lote ──────────────────────────────────────
export async function bulkCreateSlotsAction(data: unknown): Promise<ActionResult> {
  try {
    await verifyAdmin();

    const parsed = bulkCreateSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Dados inválidos.",
        error: "VALIDATION_ERROR",
      };
    }

    const slotsToInsert = parsed.data.dates.map((date) => ({
      date,
      timeStart: parsed.data.timeStart,
      timeEnd: parsed.data.timeEnd,
      status: "available" as const,
    }));

    await db.insert(scheduleSlots).values(slotsToInsert);

    revalidatePath("/admin/agenda");
    revalidatePath("/");
    revalidatePath("/api/schedules/public");

    return {
      success: true,
      message: `${slotsToInsert.length} horários criados com sucesso!`,
    };
  } catch (error) {
    console.error("[Action] Erro ao criar slots em lote:", error);
    return actionError(error);
  }
}

// ── Atualizar status de um slot ──────────────────────────────
export async function updateSlotStatusAction(
  slotId: string,
  status: "available" | "blocked"
): Promise<ActionResult> {
  try {
    await verifyAdmin();

    if (!z.string().uuid().safeParse(slotId).success) {
      return { success: false, message: "ID do slot inválido.", error: "VALIDATION_ERROR" };
    }

    await db
      .update(scheduleSlots)
      .set({ status })
      .where(eq(scheduleSlots.id, slotId));

    revalidatePath("/admin/agenda");
    revalidatePath("/");
    revalidatePath("/api/schedules/public");

    return {
      success: true,
      message: status === "blocked" ? "Horário bloqueado." : "Horário liberado.",
    };
  } catch (error) {
    console.error("[Action] Erro ao atualizar slot:", error);
    return actionError(error);
  }
}

// ── Deletar um slot ──────────────────────────────────────────
export async function deleteSlotAction(slotId: string): Promise<ActionResult> {
  try {
    await verifyAdmin();

    if (!z.string().uuid().safeParse(slotId).success) {
      return { success: false, message: "ID do slot inválido.", error: "VALIDATION_ERROR" };
    }

    await db.delete(scheduleSlots).where(eq(scheduleSlots.id, slotId));

    revalidatePath("/admin/agenda");
    revalidatePath("/");
    revalidatePath("/api/schedules/public");

    return { success: true, message: "Horário removido com sucesso!" };
  } catch (error) {
    console.error("[Action] Erro ao deletar slot:", error);
    return actionError(error);
  }
}
