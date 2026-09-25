import { db } from "@/lib/db";
import { galleryItems } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import GalleryUploader from "@/components/admin/GalleryUploader";
import { getActiveCategories } from "@/lib/actions/gallery.actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeria & Obras",
};

export const dynamic = "force-dynamic";

export default async function GaleriaPage() {
  const items = await db
    .select({
      id: galleryItems.id,
      title: galleryItems.title,
      description: galleryItems.description,
      category: galleryItems.category,
      categorySlug: galleryItems.categorySlug,
      imageUrl: galleryItems.imageUrl,
      imageKey: galleryItems.imageKey,
      featured: galleryItems.featured,
      createdAt: galleryItems.createdAt,
    })
    .from(galleryItems)
    .orderBy(desc(galleryItems.featured), desc(galleryItems.createdAt));

  const existingCategories = await getActiveCategories();

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 font-tatuadora text-[9px] uppercase tracking-[0.3em] text-[#808080]">
          Atelier · Portfólio &amp; Taxonomia
        </p>
        <h1 className="mb-1 font-russa text-4xl font-semibold text-white sm:text-5xl">
          Galeria &amp; Obras
        </h1>
        <p className="font-tatuadora text-xs font-light tracking-wide text-[#9E9E9E]">
          Gerir obras autorais, estilos dinâmicos e mídias de alta resolução.
        </p>
      </div>

      <GalleryUploader items={items} existingCategories={existingCategories} />
    </div>
  );
}
