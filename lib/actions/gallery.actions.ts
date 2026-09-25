"use server";

import { db } from "@/lib/db";
import { galleryItems } from "@/lib/db/schema";
import { galleryItemFormSchema, type GalleryItemFormData } from "@/lib/validations/gallery.schema";
import { normalizeCategory } from "@/lib/utils/taxonomy";
import { auth } from "@/lib/auth";
import { eq, asc, desc, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

// 1. Obtenção das categorias dinâmicas com cache
export const getActiveCategories = unstable_cache(
  async (): Promise<Array<{ name: string; slug: string; count: number }>> => {
    const results = await db
      .select({
        name: galleryItems.category,
        slug: galleryItems.categorySlug,
        count: sql<number>`count(*)::int`,
      })
      .from(galleryItems)
      .groupBy(galleryItems.category, galleryItems.categorySlug)
      .orderBy(asc(galleryItems.category));

    return results;
  },
  ["active-gallery-categories"],
  { tags: ["gallery-categories"], revalidate: 3600 }
);

// 2. Obtenção pública de itens
export const getGalleryItems = unstable_cache(
  async (categorySlug?: string) => {
    const query = db.select().from(galleryItems);

    if (categorySlug && categorySlug !== "todos") {
      return await query
        .where(eq(galleryItems.categorySlug, categorySlug))
        .orderBy(desc(galleryItems.featured), desc(galleryItems.displayOrder), desc(galleryItems.createdAt));
    }

    return await query.orderBy(desc(galleryItems.featured), desc(galleryItems.displayOrder), desc(galleryItems.createdAt));
  },
  ["gallery-items-list"],
  { tags: ["gallery-items"], revalidate: 3600 }
);

// 3. Mutação: Criar Nova Obra (Protegido por NextAuth)
export async function createGalleryItem(rawInput: GalleryItemFormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Não autorizado: Faça login no painel administrativo.");
  }

  const validated = galleryItemFormSchema.parse(rawInput);
  const { name: categoryName, slug: categorySlug } = normalizeCategory(validated.category);

  const [created] = await db
    .insert(galleryItems)
    .values({
      title: validated.title,
      description: validated.description || null,
      imageUrl: validated.imageUrl,
      imageKey: validated.imageKey,
      category: categoryName,
      categorySlug: categorySlug,
      featured: validated.featured,
    })
    .returning();

  // Purga de Cache de Alta Performance
  revalidateTag("gallery-items", { expire: 0 });
  revalidateTag("gallery-categories", { expire: 0 });
  revalidatePath("/");
  revalidatePath("/admin/galeria");

  return { success: true, item: created };
}

// 4. Mutação: Excluir Obra e Purgar Asset do UploadThing
export async function deleteGalleryItem(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Não autorizado.");
  }

  const [item] = await db.select().from(galleryItems).where(eq(galleryItems.id, id));
  if (!item) throw new Error("Obra não encontrada.");

  // Remove imagem do S3/UploadThing se existir chave válida
  if (item.imageKey && item.imageKey !== "external") {
    try {
      await utapi.deleteFiles(item.imageKey);
    } catch (err) {
      console.error("[UploadThing] Erro ao excluir asset:", err);
    }
  }

  await db.delete(galleryItems).where(eq(galleryItems.id, id));

  revalidateTag("gallery-items", { expire: 0 });
  revalidateTag("gallery-categories", { expire: 0 });
  revalidatePath("/");
  revalidatePath("/admin/galeria");

  return { success: true };
}

// 5. Mutação: Alternar Destaque (Featured)
export async function toggleFeaturedItem(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Não autorizado.");
  }

  const [item] = await db.select().from(galleryItems).where(eq(galleryItems.id, id));
  if (!item) throw new Error("Obra não encontrada.");

  await db
    .update(galleryItems)
    .set({ featured: !item.featured, updatedAt: new Date() })
    .where(eq(galleryItems.id, id));

  revalidateTag("gallery-items", { expire: 0 });
  revalidatePath("/");
  revalidatePath("/admin/galeria");

  return { success: true, featured: !item.featured };
}
