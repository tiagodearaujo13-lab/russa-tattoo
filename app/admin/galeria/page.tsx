import { db } from "@/lib/db";
import { galleryItems } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import GalleryUploader from "@/components/admin/GalleryUploader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeria",
};

export const dynamic = "force-dynamic";

export default async function GaleriaPage() {
  const items = await db
    .select({
      id: galleryItems.id,
      title: galleryItems.title,
      styleCategory: galleryItems.styleCategory,
      imageUrl: galleryItems.imageUrl,
      instagramPostUrl: galleryItems.instagramPostUrl,
      featured: galleryItems.featured,
    })
    .from(galleryItems)
    .orderBy(desc(galleryItems.createdAt));

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 font-tatuadora text-[9px] uppercase tracking-[0.3em] text-[#808080]">Atelier · Portfólio</p>
        <h1 className="mb-1 font-russa text-4xl font-semibold text-white sm:text-5xl">Galeria &amp; obras</h1>
        <p className="font-tatuadora text-xs font-light tracking-wide text-[#9E9E9E]">
          Gerir fotos do portfólio e links do Instagram.
        </p>
      </div>

      <GalleryUploader items={items} />
    </div>
  );
}
