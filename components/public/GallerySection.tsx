"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MessageCircle, X } from "lucide-react";
import InstagramIcon from "@/components/public/InstagramIcon";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getWhatsAppUrl, STUDIO_CONFIG, STUDIO_WHATSAPP_NUMBER } from "@/lib/constants/studio";
import { useLanguage } from "./LanguageProvider";

export type PublicGalleryItem = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  categorySlug: string;
  imageUrl: string;
  featured: boolean;
};

export type PublicCategory = {
  name: string;
  slug: string;
  count: number;
};

type GallerySectionProps = {
  items?: PublicGalleryItem[];
  categories?: PublicCategory[];
};

export default function GallerySection({
  items = [],
  categories = [],
}: GallerySectionProps) {
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>("todos");
  const [lightboxItem, setLightboxItem] = useState<PublicGalleryItem | null>(null);
  const { language, t } = useLanguage();

  // Deduplicar e sintetizar abas dinâmicas caso as categorias venham vazias
  const activeTabs = categories.length > 0
    ? categories
    : Array.from(new Set(items.map((i) => i.category))).map((cat) => ({
        name: cat,
        slug: items.find((i) => i.category === cat)?.categorySlug || cat.toLowerCase().replace(/\s+/g, "-"),
        count: items.filter((i) => i.category === cat).length,
      }));

  // Filtragem estritamente orientada aos dados reais
  const filteredItems =
    activeCategorySlug === "todos"
      ? items
      : items.filter((item) => item.categorySlug === activeCategorySlug);

  const lightboxIndex = lightboxItem
    ? filteredItems.findIndex((item) => item.id === lightboxItem.id)
    : -1;

  const quoteUrl = (item: PublicGalleryItem) => {
    if (!STUDIO_WHATSAPP_NUMBER) return "#orcamento";
    return getWhatsAppUrl(
      language === "en"
        ? `Hello Russa! I would like a quote inspired by this ${item.category} artwork: ${item.title}.`
        : `Olá Russa! Gostaria de pedir um orçamento inspirado nesta arte de ${item.category}: ${item.title}.`
    );
  };

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
        {/* Header Editorial de Luxo */}
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

        {/* Filtros Dinâmicos de Taxonomia Autoral */}
        {activeTabs.length > 0 && (
          <ScrollReveal direction="scale" delay={100} className="mb-14 flex flex-wrap justify-center gap-x-5 gap-y-3">
            <button
              type="button"
              onClick={() => setActiveCategorySlug("todos")}
              className={`h-9 px-3 font-tatuadora text-[10px] uppercase tracking-[0.2em] transition-all ${
                activeCategorySlug === "todos"
                  ? "border-b-2 border-[#1A1A1A] text-[#1A1A1A] font-bold"
                  : "border-b-2 border-transparent text-[#444444] hover:text-[#1A1A1A]"
              }`}
            >
              {language === "pt" ? "Todos os Estilos" : "All Styles"} ({items.length})
            </button>

            {activeTabs.map((tab) => (
              <button
                key={tab.slug}
                type="button"
                onClick={() => setActiveCategorySlug(tab.slug)}
                className={`h-9 px-3 font-tatuadora text-[10px] uppercase tracking-[0.2em] transition-all ${
                  activeCategorySlug === tab.slug
                    ? "border-b-2 border-[#1A1A1A] text-[#1A1A1A] font-bold"
                    : "border-b-2 border-transparent text-[#444444] hover:text-[#1A1A1A]"
                }`}
              >
                {tab.name} {tab.count > 0 && `(${tab.count})`}
              </button>
            ))}
          </ScrollReveal>
        )}

        {/* Luxury Empty State se a galeria estiver vazia ou sem obras no filtro */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-xl border border-[#1A1A1A]/15 bg-white/40 p-10 sm:p-14 text-center backdrop-blur-xs my-8 shadow-sm"
          >
            <div className="mx-auto mb-5 h-[1.5px] w-12 bg-[#1A1A1A]/40" />
            <h3 className="font-russa text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
              Curadoria em Andamento
            </h3>
            <p className="mt-4 font-tatuadora text-sm sm:text-base leading-relaxed text-[#333333] font-light">
              Novas peças autorais estão sendo catalogadas no atelier. Acompanhe os lançamentos diários através do canal exclusivo.
            </p>
            <div className="mt-8">
              <Link
                href={STUDIO_CONFIG.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#1A1A1A] bg-[#1A1A1A] px-7 py-3 font-tatuadora text-[10px] uppercase tracking-[0.2em] text-white transition-all hover:bg-transparent hover:text-[#1A1A1A]"
              >
                <span>Ver no Instagram</span>
                <span>→</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Grade de Obras Reais */
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

                  {/* Gradiente sutil no hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

                  {/* Informações no Hover */}
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white opacity-0 transition-all duration-400 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0">
                    <p className="font-tatuadora text-[9px] uppercase tracking-[0.25em] text-[#DCDCDC]">
                      {item.category}
                    </p>
                    <p className="mt-1 font-tatuadora text-lg font-light tracking-[0.05em] sm:text-xl text-white">
                      {item.title}
                    </p>
                    <Link
                      href={quoteUrl(item)}
                      target={quoteUrl(item).startsWith("http") ? "_blank" : undefined}
                      rel={quoteUrl(item).startsWith("http") ? "noopener noreferrer" : undefined}
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
                      Destaque
                    </span>
                  )}
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Botão de Instagram Editorial */}
        <ScrollReveal direction="bottom" delay={160} className="mt-16 text-center">
          <Link
            href={STUDIO_CONFIG.contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex border border-[#1A1A1A] text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white items-center gap-3 px-8 py-3.5 text-xs font-tatuadora uppercase tracking-[0.2em]"
          >
            <InstagramIcon className="h-4 w-4" />
            {t("gallery.fullPortfolio")} · {STUDIO_CONFIG.instagram.handle}
          </Link>
        </ScrollReveal>
      </div>

      {/* Lightbox Modal de Alta Resolução */}
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
                  {lightboxItem.category}
                </p>
                <p className="font-tatuadora text-2xl md:text-3xl font-light tracking-[0.05em] text-white">
                  {lightboxItem.title}
                </p>
                {lightboxItem.description && (
                  <p className="max-w-xl font-tatuadora text-xs text-white/80 font-light leading-relaxed">
                    {lightboxItem.description}
                  </p>
                )}
                <Link
                  href={quoteUrl(lightboxItem)}
                  target={quoteUrl(lightboxItem).startsWith("http") ? "_blank" : undefined}
                  rel={quoteUrl(lightboxItem).startsWith("http") ? "noopener noreferrer" : undefined}
                  onClick={() => {
                    if (!quoteUrl(lightboxItem).startsWith("http")) setLightboxItem(null);
                  }}
                  className="inline-flex items-center gap-2 rounded-xs border border-[#CCCCCC]/20 px-4 py-2 font-tatuadora text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-black"
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
