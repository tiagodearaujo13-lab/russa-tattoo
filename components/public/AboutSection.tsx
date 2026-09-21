"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import CountUp from "./CountUp";
import { useLanguage } from "./LanguageProvider";

const stats = [
  { value: 12, suffix: "+", key: "about.years" },
  { value: 1500, suffix: "+", key: "about.clients" },
  { value: 3000, suffix: "+", key: "about.tattoos" },
  { value: 100, suffix: "%", key: "about.sterile" },
];

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section
      id="sobre"
      className="relative overflow-hidden bg-gradient-to-b from-[#CCCCCC] to-[#D1D1D1] text-[#1A1A1A]"
    >
      {/* Continuação visual do Hero, suavemente integrada ao cinzento editorial. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 flex items-start justify-center select-none">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[2590/1527] w-[320px] opacity-80 mix-blend-multiply sm:w-[460px] sm:opacity-85 md:w-[620px] lg:w-[780px] lg:opacity-95 xl:w-[920px]"
        >
          <Image
            src="/images/brand/russa-continuation-bottom.png"
            alt="Russa Tatuadora — Busto e Ombros (Continuação Oficial)"
            fill
            sizes="(max-width: 640px) 320px, (max-width: 768px) 460px, (max-width: 1024px) 620px, (max-width: 1280px) 780px, 920px"
            className="object-contain object-top"
          />
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28 md:px-12 md:py-32 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl lg:max-w-3xl"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-[#1A1A1A]/40 sm:w-8" />
            <p className="font-tatuadora text-[9px] font-semibold uppercase tracking-[0.35em] text-[#1A1A1A] sm:text-[10px]">
              {t("about.eyebrow")}
            </p>
          </div>

          <h2 className="mt-3.5 font-russa text-3xl font-bold leading-[1.1] tracking-[-0.01em] text-[#1A1A1A] sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl">
            {t("about.title")}
          </h2>

          <div className="mt-4 h-px w-12 bg-[#1A1A1A]/20" />

          <div className="mt-6 space-y-4 font-times text-base font-light leading-relaxed text-[#222222] sm:mt-8 sm:text-lg">
            <p>{t("about.paragraph1")}</p>
            <p>{t("about.paragraph2")}</p>
            <p>{t("about.paragraph3")}</p>
          </div>

          <div className="mt-10 grid grid-cols-2 border-l border-t border-[#1A1A1A]/15 bg-white/40 backdrop-blur-xs sm:mt-12 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * index, duration: 0.5 }}
                className="border-b border-r border-[#1A1A1A]/15 px-3 py-4 text-center sm:px-4 sm:py-6"
              >
                <p className="font-russa text-2xl font-bold text-[#1A1A1A] sm:text-3xl md:text-4xl">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 font-tatuadora text-[8px] font-medium uppercase tracking-[0.2em] text-[#444444] sm:mt-1.5 sm:text-[9px]">
                  {t(stat.key)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
