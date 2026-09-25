"use server";

import {
  createGalleryItem,
  deleteGalleryItem,
  toggleFeaturedItem,
  getActiveCategories,
  getGalleryItems,
} from "@/lib/actions/gallery.actions";
import { galleryItemFormSchema } from "@/lib/validations/gallery.schema";

export {
  createGalleryItem,
  deleteGalleryItem,
  toggleFeaturedItem,
  getActiveCategories,
  getGalleryItems,
};

type ActionResult = {
  success: boolean;
  message: string;
  error?: string;
  item?: unknown;
};

// Aliases para manter compatibilidade com componentes existentes
export async function addGalleryItemAction(data: unknown): Promise<ActionResult> {
  try {
    const parsed = galleryItemFormSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Dados inválidos.",
        error: "VALIDATION_ERROR",
      };
    }

    const res = await createGalleryItem(parsed.data);
    return {
      success: true,
      message: "Trabalho adicionado com sucesso!",
      item: res.item,
    };
  } catch (error) {
    console.error("[Action] Erro ao adicionar item:", error);
    const message = error instanceof Error ? error.message : "Erro interno.";
    return { success: false, message, error: "ACTION_ERROR" };
  }
}

export async function removeGalleryItemAction(itemId: string): Promise<ActionResult> {
  try {
    await deleteGalleryItem(itemId);
    return { success: true, message: "Obra removida com sucesso." };
  } catch (error) {
    console.error("[Action] Erro ao remover item:", error);
    const message = error instanceof Error ? error.message : "Erro interno.";
    return { success: false, message, error: "ACTION_ERROR" };
  }
}

export const deleteGalleryItemAction = removeGalleryItemAction;

export async function toggleFeaturedAction(itemId: string): Promise<ActionResult> {
  try {
    const res = await toggleFeaturedItem(itemId);
    return {
      success: true,
      message: res.featured ? "Adicionado aos destaques!" : "Removido dos destaques.",
    };
  } catch (error) {
    console.error("[Action] Erro ao alterar destaque:", error);
    const message = error instanceof Error ? error.message : "Erro interno.";
    return { success: false, message, error: "ACTION_ERROR" };
  }
}
