"use server";

import { db } from "@/lib/db";
import { galleryItems } from "@/lib/db/schema";
import { galleryItemSchema } from "@/lib/validations/gallery.schema";
import { auth } from "@/lib/auth";
import { isAllowedAdminEmail } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ── Tipos ────────────────────────────────────────────────────
type ActionResult = {
  success: boolean;
  message: string;
  error?: string;
};

// ── Helper: Verificar admin ──────────────────────────────────
async function verifyAdmin(): Promise<void> {
  const session = await auth();
  if (!isAllowedAdminEmail(session?.user?.email)) {
    throw new Error("UNAUTHORIZED");
  }
}

function actionError(error: unknown): ActionResult {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return { success: false, message: "Acesso negado.", error: "UNAUTHORIZED" };
  }
  return { success: false, message: "Erro interno.", error: "INTERNAL_ERROR" };
}

// ── Adicionar item à galeria ─────────────────────────────────
export async function addGalleryItemAction(data: unknown): Promise<ActionResult> {
  try {
    await verifyAdmin();

    const parsed = galleryItemSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Dados inválidos.",
        error: "VALIDATION_ERROR",
      };
    }

    await db.insert(galleryItems).values(parsed.data);

    revalidatePath("/admin/galeria");
    revalidatePath("/");
    revalidatePath("/");

    return { success: true, message: "Trabalho adicionado à galeria!" };
  } catch (error) {
    console.error("[Action] Erro ao adicionar item:", error);
    return actionError(error);
  }
}

// ── Remover item da galeria ──────────────────────────────────
export async function removeGalleryItemAction(itemId: string): Promise<ActionResult> {
  try {
    await verifyAdmin();

    if (!z.string().uuid().safeParse(itemId).success) {
      return { success: false, message: "ID inválido.", error: "VALIDATION_ERROR" };
    }

    await db.delete(galleryItems).where(eq(galleryItems.id, itemId));

    revalidatePath("/admin/galeria");
    revalidatePath("/");
    revalidatePath("/");

    return { success: true, message: "Trabalho removido da galeria." };
  } catch (error) {
    console.error("[Action] Erro ao remover item:", error);
    return actionError(error);
  }
}

// Nome explícito usado pelo painel e pela camada de autorização.
export const deleteGalleryItemAction = removeGalleryItemAction;

// ── Toggle featured ──────────────────────────────────────────
export async function toggleFeaturedAction(itemId: string): Promise<ActionResult> {
  try {
    await verifyAdmin();

    if (!z.string().uuid().safeParse(itemId).success) {
      return { success: false, message: "ID inválido.", error: "VALIDATION_ERROR" };
    }

    const [item] = await db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.id, itemId))
      .limit(1);

    if (!item) {
      return { success: false, message: "Item não encontrado.", error: "NOT_FOUND" };
    }

    await db
      .update(galleryItems)
      .set({ featured: !item.featured })
      .where(eq(galleryItems.id, itemId));

    revalidatePath("/admin/galeria");
    revalidatePath("/");
    revalidatePath("/");

    return {
      success: true,
      message: item.featured ? "Removido dos destaques." : "Adicionado aos destaques!",
    };
  } catch (error) {
    console.error("[Action] Erro ao toggle featured:", error);
    return actionError(error);
  }
}

// ── Atualizar item da galeria ────────────────────────────────
export async function updateGalleryItemAction(
  itemId: string,
  data: unknown
): Promise<ActionResult> {
  try {
    await verifyAdmin();

    if (!z.string().uuid().safeParse(itemId).success) {
      return { success: false, message: "ID inválido.", error: "VALIDATION_ERROR" };
    }

    const parsed = galleryItemSchema.partial().safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Dados inválidos.",
        error: "VALIDATION_ERROR",
      };
    }

    await db
      .update(galleryItems)
      .set(parsed.data)
      .where(eq(galleryItems.id, itemId));

    revalidatePath("/admin/galeria");
    revalidatePath("/");
    revalidatePath("/");

    return { success: true, message: "Item atualizado com sucesso!" };
  } catch (error) {
    console.error("[Action] Erro ao atualizar item:", error);
    return actionError(error);
  }
}
