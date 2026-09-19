import HeroSection from "@/components/public/HeroSection";
import AboutSection from "@/components/public/AboutSection";
import FeaturesStyles from "@/components/public/FeaturesStyles";
import PiercingSection from "@/components/public/PiercingSection";
import LiveCalendarWidget from "@/components/public/LiveCalendarWidget";
import GallerySection from "@/components/public/GallerySection";
import FAQSection from "@/components/public/FAQSection";
import ContactSection from "@/components/public/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturesStyles />
      <PiercingSection />
      <LiveCalendarWidget />
      <GallerySection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
