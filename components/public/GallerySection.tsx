"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MessageCircle, X } from "lucide-react";
import InstagramIcon from "@/components/public/InstagramIcon";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getWhatsAppUrl, STUDIO_CONFIG } from "@/lib/constants/studio";

const categories = ["Todos", "Blackwork", "Old School", "Realismo", "Fine Line", "Piercing"];

const placeholderItems = [
  { id: "placeholder-1", title: "Rosa Fine Line", styleCategory: "Fine Line", imageUrl: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80", instagramPostUrl: STUDIO_CONFIG.instagram, featured: true },
  { id: "placeholder-2", title: "Mandala Geométrica", styleCategory: "Old School", imageUrl: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=800&q=80", instagramPostUrl: STUDIO_CONFIG.instagram, featured: true },
  { id: "placeholder-3", title: "Blackwork Floral", styleCategory: "Blackwork", imageUrl: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80", instagramPostUrl: STUDIO_CONFIG.instagram, featured: false },
  { id: "placeholder-4", title: "Retrato Realista", styleCategory: "Realismo", imageUrl: "https://images.unsplash.com/photo-1581783898382-80983a5e3e1e?q=80&w=600&auto=format&fit=crop", instagramPostUrl: STUDIO_CONFIG.instagram, featured: false },
  { id: "placeholder-5", title: "Minimal Butterfly", styleCategory: "Fine Line", imageUrl: "https://images.unsplash.com/photo-1604431696980-07e518647610?q=80&w=600&auto=format&fit=crop", instagramPostUrl: STUDIO_CONFIG.instagram, featured: true },
  { id: "placeholder-6", title: "Fine Line Wildflower", styleCategory: "Fine Line", imageUrl: "https://images.unsplash.com/photo-1598371839696-5c5bb1c12015?q=80&w=600&auto=format&fit=crop", instagramPostUrl: STUDIO_CONFIG.instagram, featured: false },
];

type GalleryItem = {
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
  const hasRealItems = items.length > 0;
  const displayItems = hasRealItems ? items : placeholderItems;
  const filteredItems = activeCategory === "Todos"
    ? displayItems
    : displayItems.filter((item) => item.styleCategory === activeCategory);

  const quoteUrl = (item: GalleryItem) =>
    getWhatsAppUrl(`Olá Russa! Gostaria de pedir um orçamento inspirado nesta arte de ${item.styleCategory}: ${item.title}.`);

  return (
    <section id="galeria" className="relative py-24 md:py-32">
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-sm bg-white/3 blur-3xl" />
      <div className="container relative mx-auto max-w-7xl px-4">
        <ScrollReveal direction="bottom" className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-white">Portfólio</span>
          <h2 className="mt-3 mb-4 font-display text-4xl md:text-5xl">Galeria de Trabalhos</h2>
          <p className="mx-auto max-w-2xl text-foreground/60">Cada peça é uma obra única. Explore os trabalhos e encontre inspiração para a sua próxima tatuagem.</p>
        </ScrollReveal>

        <ScrollReveal direction="scale" delay={100} className="mb-12 flex flex-wrap justify-center gap-x-6 gap-y-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`border-b-2 px-1 pb-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
                activeCategory === category
                  ? "border-white text-white"
                  : "border-transparent text-zinc-500 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </ScrollReveal>

        <motion.div layout className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="group relative aspect-square cursor-pointer overflow-hidden border border-white/10 bg-[#0a0a0a] transition-all duration-500 hover:-translate-y-2 hover:border-white/40 hover:bg-gradient-to-b hover:from-zinc-900 hover:to-black hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.07)]"
                onClick={() => setLightboxItem(item)}
              >
                <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-black/25 transition-colors duration-500 group-hover:bg-black/65" />
                <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:p-5">
                  <p className="font-display text-lg text-white">{item.title}</p>
                  <Badge variant="outline" className="mt-2 border-white/40 text-xs text-white">{item.styleCategory}</Badge>
                  <Link href={quoteUrl(item)} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} className="mt-3 inline-flex items-center gap-2 border border-white/40 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black">
                    <MessageCircle className="h-3.5 w-3.5" />
                    Pedir orçamento
                  </Link>
                </div>
                {item.featured && <Badge className="absolute right-2 top-2 bg-white/90 text-[10px] text-background">Destaque</Badge>}
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {hasRealItems && (
          <ScrollReveal direction="bottom" delay={160} className="mt-12 text-center">
            <Link href={STUDIO_CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-white px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black">
              <InstagramIcon className="h-4 w-4" />
              Ver portfólio completo
            </Link>
          </ScrollReveal>
        )}
      </div>

      <AnimatePresence>
        {lightboxItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setLightboxItem(null)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="relative max-h-[80vh] w-full max-w-3xl" onClick={(event) => event.stopPropagation()}>
              <img src={lightboxItem.imageUrl} alt={lightboxItem.title} className="h-full w-full rounded-sm object-contain" />
              <div className="absolute inset-x-0 bottom-0 rounded-b-sm bg-gradient-to-t from-black/90 to-transparent p-6 pt-16">
                <p className="font-display text-2xl text-white">{lightboxItem.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="border-white/30 text-white">{lightboxItem.styleCategory}</Badge>
                  <Link href={quoteUrl(lightboxItem)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-white hover:underline"><MessageCircle className="h-3 w-3" /> Pedir orçamento desta arte</Link>
                  <Link href={lightboxItem.instagramPostUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-foreground/60 hover:text-white"><ExternalLink className="h-3 w-3" /> Instagram</Link>
                </div>
              </div>
              <button onClick={() => setLightboxItem(null)} className="absolute right-4 top-4 rounded-sm border border-white/20 bg-black/40 p-2 text-white hover:bg-white hover:text-black" aria-label="Fechar"><X className="h-5 w-5" /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
