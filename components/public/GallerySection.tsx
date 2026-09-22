"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MessageCircle, X } from "lucide-react";
import InstagramIcon from "@/components/public/InstagramIcon";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getWhatsAppUrl, STUDIO_CONFIG } from "@/lib/constants/studio";
import { useLanguage } from "./LanguageProvider";

const categories = [
  { value: "Todos", key: "gallery.all" },
  { value: "Fine Line", key: "gallery.fineLine" },
  { value: "Botânica", key: "gallery.botanic" },
  { value: "Micro-Realismo", key: "gallery.microRealism" },
  { value: "Lettering", key: "gallery.lettering" },
  { value: "Piercing", key: "gallery.piercing" },
];

const fineLinePlaceholderItems = [
  {
    id: "gallery-1",
    title: "Orquídea Anatómica",
    styleCategory: "Botânica",
    imageUrl: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80",
    instagramPostUrl: STUDIO_CONFIG.instagram,
    featured: true,
  },
  {
    id: "gallery-2",
    title: "Traço Fino Minimalista",
    styleCategory: "Fine Line",
    imageUrl: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80",
    instagramPostUrl: STUDIO_CONFIG.instagram,
    featured: false,
  },
  {
    id: "gallery-3",
    title: "Micro-Fauna Delicada",
    styleCategory: "Micro-Realismo",
    imageUrl: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80",
    instagramPostUrl: STUDIO_CONFIG.instagram,
    featured: true,
  },
  {
    id: "gallery-4",
    title: "Borboleta & Linhas Finas",
    styleCategory: "Fine Line",
    imageUrl: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?auto=format&fit=crop&w=800&q=80",
    instagramPostUrl: STUDIO_CONFIG.instagram,
    featured: false,
  },
  {
    id: "gallery-5",
    title: "Ramo Silvestre de Oliveira",
    styleCategory: "Botânica",
    imageUrl: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80",
    instagramPostUrl: STUDIO_CONFIG.instagram,
    featured: false,
  },
  {
    id: "gallery-6",
    title: "Lettering Poético",
    styleCategory: "Lettering",
    imageUrl: "https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=800&q=80",
    instagramPostUrl: STUDIO_CONFIG.instagram,
    featured: true,
  },
  {
    id: "gallery-7",
    title: "Geometria Astral & Fine Line",
    styleCategory: "Fine Line",
    imageUrl: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=800&q=80",
    instagramPostUrl: STUDIO_CONFIG.instagram,
    featured: false,
  },
  {
    id: "gallery-8",
    title: "Jóia Titânio Conch & Hélix",
    styleCategory: "Piercing",
    imageUrl: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80",
    instagramPostUrl: STUDIO_CONFIG.instagram,
    featured: true,
  },
];

export type GalleryItem = {
  id: string;
  title: string;
  styleCategory: string;
  imageUrl: string;
  instagramPostUrl: string;
  featured: boolean;
};

export default function GallerySection({ items = [] }: { items?: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const { language, t } = useLanguage();

  const displayItems = items.length > 0 ? items : fineLinePlaceholderItems;
  const filteredItems =
    activeCategory === "Todos"
      ? displayItems
      : displayItems.filter((item) => item.styleCategory.toLowerCase() === activeCategory.toLowerCase());

  const lightboxIndex = lightboxItem
    ? filteredItems.findIndex((item) => item.id === lightboxItem.id)
    : -1;

  const quoteUrl = (item: GalleryItem) =>
    getWhatsAppUrl(
      language === "en"
        ? `Hello Russa! I would like a quote inspired by this ${item.styleCategory} artwork: ${item.title}.`
        : `Olá Russa! Gostaria de pedir um orçamento inspirado nesta arte de ${item.styleCategory}: ${item.title}.`
    );

  useEffect(() => {
    if (!lightboxItem) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxItem(null);
      if (event.key === "ArrowRight")
        setLightboxItem(
          (current) =>
            current &&
            filteredItems[(filteredItems.findIndex((item) => item.id === current.id) + 1) % filteredItems.length]
        );
      if (event.key === "ArrowLeft")
        setLightboxItem(
          (current) =>
            current &&
            filteredItems[
              (filteredItems.findIndex((item) => item.id === current.id) - 1 + filteredItems.length) %
                filteredItems.length
            ]
        );
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxItem, filteredItems]);

  const moveLightbox = (direction: 1 | -1) => {
    if (lightboxIndex < 0) return;
    setLightboxItem(
      filteredItems[(lightboxIndex + direction + filteredItems.length) % filteredItems.length]
    );
  };

  return (
    <section id="galeria" className="relative bg-gradient-to-b from-[#CCCCCC] to-[#D1D1D1] py-24 sm:py-28 text-[#1A1A1A] md:py-36 border-t border-[#1A1A1A]/15">
      <div className="container relative mx-auto max-w-7xl px-5 sm:px-8 md:px-12">
        {/* Header */}
        <ScrollReveal direction="bottom" className="mb-14 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-6 bg-[#1A1A1A]" />
            <span className="font-tatuadora text-[9.5px] uppercase tracking-[0.3em] text-[#333333] font-medium">
              {t("gallery.eyebrow")}
            </span>
            <span className="h-[1px] w-6 bg-[#1A1A1A]" />
          </div>

          <h2 className="mt-4 font-russa text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[-0.01em] text-[#1A1A1A] font-bold">
            {t("gallery.title")}
          </h2>

          <div className="mx-auto mt-4 h-[1.5px] w-12 bg-[#1A1A1A]/20" />

          <p className="mx-auto mt-5 max-w-2xl font-tatuadora text-base sm:text-lg font-normal text-[#222222] leading-relaxed">
            {t("gallery.support")}
          </p>
        </ScrollReveal>

        {/* Filter Categories */}
        <ScrollReveal direction="scale" delay={100} className="mb-14 flex flex-wrap justify-center gap-x-6 gap-y-3">
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setActiveCategory(category.value)}
              className={`h-9 px-3 font-tatuadora text-[10px] uppercase tracking-[0.2em] font-medium transition-all ${
                activeCategory === category.value
                  ? "border-b-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold"
                  : "border-b-2 border-transparent text-[#333333] hover:text-[#1A1A1A]"
              }`}
            >
              {t(category.key)}
            </button>
          ))}
        </ScrollReveal>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className={`group relative ${
                  index % 3 === 1 ? "aspect-[3/4]" : "aspect-square"
                } cursor-pointer overflow-hidden border border-[#1A1A1A]/15 bg-[#D1D1D1] shadow-[0_4px_20px_rgba(0,0,0,0.5)]`}
                onClick={() => setLightboxItem(item)}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover grayscale contrast-115 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

                {/* Hover details */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-white opacity-0 transition-all duration-400 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0">
                  <p className="font-tatuadora text-[9px] uppercase tracking-[0.25em] text-[#DCDCDC]">
                    {item.styleCategory}
                  </p>
                  <p className="mt-1 font-tatuadora text-lg font-light tracking-[0.05em] sm:text-xl text-white">
                    {item.title}
                  </p>
                  <Link
                    href={quoteUrl(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="mt-3 inline-flex items-center gap-2 rounded-xs border border-white/40 px-3 py-1.5 font-tatuadora text-[9.5px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-black"
                  >
                    <MessageCircle className="h-3 w-3" />
                    {t("gallery.quote")}
                  </Link>
                </div>

                {item.featured && (
                  <span
                    aria-label="Destaque"
                    className="absolute top-3 right-3 font-tatuadora text-[8px] uppercase tracking-[0.2em] bg-white/90 text-zinc-900 px-2 py-0.5 font-medium shadow-xs"
                  >
                    Fine Line
                  </span>
                )}
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Instagram Profile CTA Button */}
        <ScrollReveal direction="bottom" delay={160} className="mt-16 text-center">
          <Link
            href={STUDIO_CONFIG.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex border border-[#1A1A1A] text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white items-center gap-3 px-8 py-3.5 text-xs"
          >
            <InstagramIcon className="h-4 w-4" />
            {t("gallery.fullPortfolio")} · @russatatuadora
          </Link>
        </ScrollReveal>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
            onClick={() => setLightboxItem(null)}
            role="dialog"
            aria-modal="true"
            aria-label={lightboxItem.title}
          >
            <button
              type="button"
              onClick={() => moveLightbox(-1)}
              className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xs border border-white/20 text-white transition-colors hover:bg-white hover:text-black md:left-8"
              aria-label="Previous artwork"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
              className="relative h-[82vh] w-full max-w-4xl"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-contain"
              />

              <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 pt-20 md:p-8">
                <p className="font-tatuadora text-[10px] uppercase tracking-[0.3em] text-white/70">
                  {lightboxItem.styleCategory}
                </p>
                <p className="font-tatuadora text-2xl md:text-3xl font-light tracking-[0.05em] text-white">
                  {lightboxItem.title}
                </p>
                <Link
                  href={quoteUrl(lightboxItem)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xs border border-[#CCCCCC]/200 px-4 py-2 font-tatuadora text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-black"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  {t("gallery.quoteThis")}
                </Link>
                <span className="font-tatuadora text-[10px] tracking-[0.25em] text-white/50">
                  {String(lightboxIndex + 1).padStart(2, "0")} / {String(filteredItems.length).padStart(2, "0")}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xs border border-white/20 text-white transition-colors hover:bg-white hover:text-black md:right-5 md:top-5"
                aria-label={t("gallery.close")}
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>

            <button
              type="button"
              onClick={() => moveLightbox(1)}
              className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xs border border-white/20 text-white transition-colors hover:bg-white hover:text-black md:right-8"
              aria-label="Next artwork"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
