import HeroSection from "@/components/public/HeroSection";
import AboutSection from "@/components/public/AboutSection";
import FeaturesStyles from "@/components/public/FeaturesStyles";
import QuoteRequestSection from "@/components/public/QuoteRequestSection";
import GallerySection from "@/components/public/GallerySection";
import FAQSection from "@/components/public/FAQSection";
import ContactSection from "@/components/public/ContactSection";
import { getGalleryItems, getActiveCategories } from "@/lib/actions/gallery.actions";

export const revalidate = 3600; // Cache revalidado sob demanda via Server Actions

export default async function HomePage() {
  const [items, categories] = await Promise.all([
    getGalleryItems(),
    getActiveCategories(),
  ]);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturesStyles />
      <QuoteRequestSection />
      <GallerySection items={items} categories={categories} />
      <FAQSection />
      <ContactSection />
    </>
  );
}
