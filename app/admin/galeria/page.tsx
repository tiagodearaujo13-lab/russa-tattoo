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
        <h1 className="font-display text-3xl mb-1">Galeria</h1>
        <p className="text-sm text-foreground/50">
          Gerir fotos do portfólio e links do Instagram.
        </p>
      </div>

      <GalleryUploader items={items} />
    </div>
  );
}
