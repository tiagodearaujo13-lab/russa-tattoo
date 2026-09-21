"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  Compass,
  Feather,
  Flower2,
  Minimize2,
  ShieldAlert,
} from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const fineLineStyles = [
  {
    key: "styles.fineLineBotanic",
    descKey: "styles.fineLineBotanicDesc",
    icon: Flower2,
    image:
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "styles.microRealism",
    descKey: "styles.microRealismDesc",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "styles.lettering",
    descKey: "styles.letteringDesc",
    icon: Feather,
    image:
      "https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "styles.geometric",
    descKey: "styles.geometricDesc",
    icon: Minimize2,
    image:
      "https://images.unsplash.com/photo-1590246814883-578336ff327e?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "styles.softBlackwork",
    descKey: "styles.softBlackworkDesc",
    icon: ShieldAlert,
    image:
      "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "styles.ornamental",
    descKey: "styles.ornamentalDesc",
    icon: Compass,
    image:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
  },
];

export default function FeaturesStyles() {
  const { t } = useLanguage();

  return (
    <section
      id="estilos"
      className="relative overflow-hidden bg-[#1A1A1A] py-24 sm:py-28 md:py-36 text-white border-t border-[#CCCCCC]/20"
    >
      <div className="container mx-auto max-w-7xl px-5 sm:px-8 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 max-w-2xl"
        >
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-6 bg-[#808080]" />
            <p className="font-tatuadora text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#DCDCDC] font-medium">
              {t("styles.eyebrow")}
            </p>
          </div>

          <h2 className="mt-4 font-russa text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[-0.01em] text-white font-bold leading-[1.05]">
            {t("styles.title")}
          </h2>

          <div className="mt-4 h-[1.5px] w-12 bg-white/30" />

          <p className="mt-5 max-w-xl font-times text-base sm:text-lg font-normal leading-relaxed text-[#DCDCDC]">
            {t("styles.support")}
          </p>
        </motion.div>

        {/* Styles Grid: 3 columns x 2 rows */}
        <div className="grid grid-cols-1 border-l border-t border-[#CCCCCC]/20 sm:grid-cols-2 lg:grid-cols-3">
          {fineLineStyles.map((style, index) => {
            const Icon = style.icon;
            return (
              <motion.div
                key={style.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
                className="group relative flex flex-col justify-between overflow-hidden border-b border-r border-[#CCCCCC]/20 bg-[#222222]/70 p-6 sm:p-7 transition-all duration-500 hover:bg-[#222222]"
              >
                {/* Background image com hover sutil */}
                <div className="relative mb-6 aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#1a1a1e]">
                  <Image
                    src={style.image}
                    alt={`Estilo ${t(style.key)}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover grayscale contrast-110 brightness-90 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-transparent opacity-60" />
                </div>

                {/* Content */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#CCCCCC]">
                      <Icon className="h-4 w-4 text-white" />
                      <span className="font-tatuadora text-[9px] uppercase tracking-[0.25em] text-[#808080] font-medium">
                        0{index + 1}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-russa text-xl sm:text-2xl font-bold text-white tracking-[-0.01em]">
                    {t(style.key)}
                  </h3>

                  <p className="mt-2 font-times text-sm sm:text-base font-normal leading-relaxed text-[#CCCCCC]">
                    {t(style.descKey)}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#CCCCCC]/20 flex items-center justify-between">
                  <span className="font-tatuadora text-[8.5px] uppercase tracking-[0.2em] text-[#808080] group-hover:text-white transition-colors">
                    Atelier Fine Line
                  </span>
                  <span className="font-sans text-sm text-[#808080] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">
                    →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
