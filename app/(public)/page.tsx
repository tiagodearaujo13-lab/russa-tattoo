import HeroSection from "@/components/public/HeroSection";
import AboutSection from "@/components/public/AboutSection";
import FeaturesStyles from "@/components/public/FeaturesStyles";
import PiercingSection from "@/components/public/PiercingSection";
import LiveCalendarWidget from "@/components/public/LiveCalendarWidget";
import GallerySection from "@/components/public/GallerySection";
import FAQSection from "@/components/public/FAQSection";
import ContactSection from "@/components/public/ContactSection";
import { db } from "@/lib/db";
import { galleryItems } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export default async function HomePage() {
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
    <>
      <HeroSection />
      <AboutSection />
      <FeaturesStyles />
      <PiercingSection />
      <LiveCalendarWidget />
      <GallerySection items={items} />
      <FAQSection />
      <ContactSection />
    </>
  );
}
