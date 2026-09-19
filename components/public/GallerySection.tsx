"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, X } from "lucide-react";
import InstagramIcon from "@/components/public/InstagramIcon";

const categories = [
  "Todos",
  "Fine Line",
  "Blackwork",
  "Minimalista",
  "Realismo",
  "Geométrico",
  "Lettering",
];

// Placeholder gallery items (substituídos por dados do banco em produção)
const placeholderItems = [
  {
    id: "1",
    title: "Rosa Fine Line",
    styleCategory: "Fine Line",
    imageUrl: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=600&auto=format&fit=crop",
    instagramPostUrl: "https://www.instagram.com/russatatuadora/",
    featured: true,
  },
  {
    id: "2",
    title: "Mandala Geométrica",
    styleCategory: "Geométrico",
    imageUrl: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?q=80&w=600&auto=format&fit=crop",
    instagramPostUrl: "https://www.instagram.com/russatatuadora/",
    featured: true,
  },
  {
    id: "3",
    title: "Blackwork Floral",
    styleCategory: "Blackwork",
    imageUrl: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=600&auto=format&fit=crop",
    instagramPostUrl: "https://www.instagram.com/russatatuadora/",
    featured: false,
  },
  {
    id: "4",
    title: "Lettering Script",
    styleCategory: "Lettering",
    imageUrl: "https://images.unsplash.com/photo-1542856204-00101eb6def4?q=80&w=600&auto=format&fit=crop",
    instagramPostUrl: "https://www.instagram.com/russatatuadora/",
    featured: false,
  },
  {
    id: "5",
    title: "Minimal Butterfly",
    styleCategory: "Minimalista",
    imageUrl: "https://images.unsplash.com/photo-1604431696980-07e518647610?q=80&w=600&auto=format&fit=crop",
    instagramPostUrl: "https://www.instagram.com/russatatuadora/",
    featured: true,
  },
  {
    id: "6",
    title: "Retrato Realista",
    styleCategory: "Realismo",
    imageUrl: "https://images.unsplash.com/photo-1581783898382-80983a5e3e1e?q=80&w=600&auto=format&fit=crop",
    instagramPostUrl: "https://www.instagram.com/russatatuadora/",
    featured: false,
  },
  {
    id: "7",
    title: "Fine Line Wildflower",
    styleCategory: "Fine Line",
    imageUrl: "https://images.unsplash.com/photo-1598371839696-5c5bb1c12015?q=80&w=600&auto=format&fit=crop",
    instagramPostUrl: "https://www.instagram.com/russatatuadora/",
    featured: false,
  },
  {
    id: "8",
    title: "Geometric Wolf",
    styleCategory: "Geométrico",
    imageUrl: "https://images.unsplash.com/photo-1590246814883-57c511c5c5d0?q=80&w=600&auto=format&fit=crop",
    instagramPostUrl: "https://www.instagram.com/russatatuadora/",
    featured: true,
  },
];

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [lightboxItem, setLightboxItem] = useState<(typeof placeholderItems)[0] | null>(null);

  const filteredItems =
    activeCategory === "Todos"
      ? placeholderItems
      : placeholderItems.filter((item) => item.styleCategory === activeCategory);

  return (
    <section id="galeria" className="py-24 md:py-32 relative">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/3 rounded-sm blur-3xl" />

      <div className="container mx-auto px-4 max-w-7xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-white text-sm font-semibold tracking-widest uppercase">
            Portfólio
          </span>
          <h2 className="font-display text-4xl md:text-5xl mt-3 mb-4">
            Galeria de Trabalhos
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Cada peça é uma obra única. Explore os trabalhos e encontre inspiração para a sua próxima tatuagem.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-white text-background"
                  : "glass text-foreground/60 hover:text-foreground hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative aspect-square rounded-sm overflow-hidden cursor-pointer"
                onClick={() => setLightboxItem(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="text-center px-4">
                    <p className="font-display text-lg text-foreground mb-2">
                      {item.title}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-xs border-white/30 text-white"
                    >
                      {item.styleCategory}
                    </Badge>
                    <div className="flex items-center justify-center gap-3 mt-3">
                      <Link
                        href={item.instagramPostUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-sm bg-white/10 hover:bg-white hover:text-black text-foreground transition-all"
                        aria-label="Ver no Instagram"
                      >
                        <InstagramIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Featured badge */}
                {item.featured && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-white/90 text-background text-[10px]">
                      Destaque
                    </Badge>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA Instagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            asChild
            className="bg-white text-black font-semibold px-8 rounded-sm hover:scale-105 transition-transform"
          >
            <Link
              href={process.env.NEXT_PUBLIC_STUDIO_INSTAGRAM || "https://www.instagram.com/russatatuadora/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon className="w-4 h-4 mr-2" />
              Ver mais no Instagram
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-3xl max-h-[80vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                className="w-full h-full object-contain rounded-sm"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-sm">
                <p className="font-display text-2xl">{lightboxItem.title}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge
                    variant="outline"
                    className="border-white/30 text-white text-xs"
                  >
                    {lightboxItem.styleCategory}
                  </Badge>
                  <Link
                    href={lightboxItem.instagramPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-foreground/60 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Ver no Instagram
                  </Link>
                </div>
              </div>
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 p-2 rounded-sm glass text-foreground hover:text-white transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
