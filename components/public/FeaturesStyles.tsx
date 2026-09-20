"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Flower2, Eye, PenTool, Shapes, Moon, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useLanguage } from "./LanguageProvider";

const fineLineStyles = [
  {
    icon: Flower2,
    key: "styles.fineLineBotanic",
    descKey: "styles.fineLineBotanicDesc",
    image: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=800&auto=format&fit=crop",
  },
  {
    icon: Eye,
    key: "styles.microRealism",
    descKey: "styles.microRealismDesc",
    image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=800&auto=format&fit=crop",
  },
  {
    icon: PenTool,
    key: "styles.lettering",
    descKey: "styles.letteringDesc",
    image: "https://images.unsplash.com/photo-1560707303-4e980ce876ad?q=80&w=800&auto=format&fit=crop",
  },
  {
    icon: Shapes,
    key: "styles.geometric",
    descKey: "styles.geometricDesc",
    image: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=800&auto=format&fit=crop",
  },
  {
    icon: Moon,
    key: "styles.softBlackwork",
    descKey: "styles.softBlackworkDesc",
    image: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=800&auto=format&fit=crop",
  },
  {
    icon: Sparkles,
    key: "styles.ornamental",
    descKey: "styles.ornamentalDesc",
    image: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?q=80&w=800&auto=format&fit=crop",
  },
];

export default function FeaturesStyles() {
  const { t } = useLanguage();

  return (
    <section
      id="estilos"
      className="section-light relative overflow-hidden bg-[#faf9f6] py-28 text-zinc-900 md:py-36 border-t border-black/5"
    >
      <div className="container mx-auto max-w-7xl px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 max-w-2xl"
        >
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-6 bg-zinc-400" />
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-medium">
              {t("styles.eyebrow")}
            </p>
          </div>

          <h2 className="mt-4 font-edo text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.05em] text-zinc-950 leading-[1.05]">
            {t("styles.title")}
          </h2>

          <div className="mt-4 h-[1.5px] w-12 bg-zinc-900" />

          <p className="mt-5 max-w-xl font-times text-base sm:text-lg font-normal leading-relaxed text-zinc-600">
            {t("styles.support")}
          </p>
        </motion.div>

        {/* Styles Grid: 3 columns x 2 rows */}
        <div className="grid grid-cols-1 border-l border-t border-black/10 sm:grid-cols-2 lg:grid-cols-3">
          {fineLineStyles.map((style, index) => {
            const Icon = style.icon;
            return (
              <ScrollReveal
                key={style.key}
                direction="bottom"
                delay={index * 70}
                className="group relative flex flex-col justify-between overflow-hidden border-b border-r border-black/10 bg-white p-7 transition-all duration-500 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
              >
                {/* Background image on subtle hover */}
                <div className="relative mb-6 aspect-[16/10] w-full overflow-hidden rounded-xs bg-zinc-100">
                  <Image
                    src={style.image}
                    alt={`Estilo ${t(style.key)}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover grayscale contrast-110 brightness-95 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Content */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-700">
                      <Icon className="h-4 w-4" />
                      <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-zinc-400 font-medium">
                        0{index + 1}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-edo text-xl sm:text-2xl font-normal text-zinc-950 tracking-[0.03em]">
                    {t(style.key)}
                  </h3>

                  <p className="mt-2 font-times text-sm sm:text-base font-normal leading-relaxed text-zinc-600">
                    {t(style.descKey)}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between">
                  <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-950 transition-colors">
                    Atelier Fine Line
                  </span>
                  <span className="font-sans text-sm text-zinc-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-zinc-950">
                    →
                  </span>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
