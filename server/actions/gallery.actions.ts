"use server";

import { db } from "@/lib/db";
import { galleryItems } from "@/lib/db/schema";
import { galleryItemSchema } from "@/lib/validations/gallery.schema";
import { auth } from "@/lib/auth";
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
async function verifyAdmin(): Promise<{ authorized: boolean; error?: ActionResult }> {
  const session = await auth();
  if (
    !session?.user?.email ||
    session.user.email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()
  ) {
    return {
      authorized: false,
      error: { success: false, message: "Acesso negado.", error: "FORBIDDEN" },
    };
  }
  return { authorized: true };
}

// ── Adicionar item à galeria ─────────────────────────────────
export async function addGalleryItemAction(data: unknown): Promise<ActionResult> {
  try {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.authorized) return adminCheck.error!;

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

    return { success: true, message: "Trabalho adicionado à galeria!" };
  } catch (error) {
    console.error("[Action] Erro ao adicionar item:", error);
    return { success: false, message: "Erro interno.", error: "INTERNAL_ERROR" };
  }
}

// ── Remover item da galeria ──────────────────────────────────
export async function removeGalleryItemAction(itemId: string): Promise<ActionResult> {
  try {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.authorized) return adminCheck.error!;

    if (!z.string().uuid().safeParse(itemId).success) {
      return { success: false, message: "ID inválido.", error: "VALIDATION_ERROR" };
    }

    await db.delete(galleryItems).where(eq(galleryItems.id, itemId));

    revalidatePath("/admin/galeria");
    revalidatePath("/");

    return { success: true, message: "Trabalho removido da galeria." };
  } catch (error) {
    console.error("[Action] Erro ao remover item:", error);
    return { success: false, message: "Erro interno.", error: "INTERNAL_ERROR" };
  }
}

// ── Toggle featured ──────────────────────────────────────────
export async function toggleFeaturedAction(itemId: string): Promise<ActionResult> {
  try {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.authorized) return adminCheck.error!;

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

    return {
      success: true,
      message: item.featured ? "Removido dos destaques." : "Adicionado aos destaques!",
    };
  } catch (error) {
    console.error("[Action] Erro ao toggle featured:", error);
    return { success: false, message: "Erro interno.", error: "INTERNAL_ERROR" };
  }
}

// ── Atualizar item da galeria ────────────────────────────────
export async function updateGalleryItemAction(
  itemId: string,
  data: unknown
): Promise<ActionResult> {
  try {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.authorized) return adminCheck.error!;

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

    return { success: true, message: "Item atualizado com sucesso!" };
  } catch (error) {
    console.error("[Action] Erro ao atualizar item:", error);
    return { success: false, message: "Erro interno.", error: "INTERNAL_ERROR" };
  }
}
