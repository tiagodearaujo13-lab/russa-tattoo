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
      className="section-light relative overflow-hidden bg-white text-zinc-950 py-20 sm:py-28 md:py-36 border-t border-black/5"
    >
      {/* Efeito de Transição Suave e Transparência na Entrada do Scroll */}
      <motion.div
        initial={{ opacity: 0.15, y: 70 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.18 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="container mx-auto max-w-7xl px-5 sm:px-8 md:px-12"
      >
        <div className="grid items-center gap-12 sm:gap-16 lg:grid-cols-[0.88fr_1.12fr] lg:gap-24">
          {/* Foto da Artista / Atelier — Moldura com Sombras Delicadas */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative mx-auto w-full max-w-sm sm:max-w-md"
          >
            <div className="relative border border-black/10 bg-zinc-50 p-2.5 sm:p-3 shadow-[0_16px_48px_rgba(0,0,0,0.06)]">
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-200">
                <Image
                  src="https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=1200&q=85"
                  alt="Russa Tattoo Artist no atelier"
                  fill
                  sizes="(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 38vw"
                  className="object-cover grayscale contrast-110 transition-all duration-700 hover:grayscale-0"
                />
              </div>
            </div>

            {/* Badge Flutuante 12+ Anos — Otimizado para Mobile e Desktop */}
            <div className="absolute -bottom-5 right-2 sm:-right-4 border border-black/10 bg-white px-5 py-3.5 sm:px-7 sm:py-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <p className="font-edo text-2xl sm:text-3xl md:text-4xl text-zinc-950">
                <CountUp value={12} suffix="+" />
              </p>
              <p className="mt-0.5 sm:mt-1 font-sans text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.22em] text-zinc-500 font-semibold">
                {t("about.years")}
              </p>
            </div>
          </motion.div>

          {/* Conteúdo Editorial com Alto Contraste (Fundo Branco, Letras Pretas) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <span className="h-[1.5px] w-6 sm:w-8 bg-zinc-900" />
              <p className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-semibold">
                {t("about.eyebrow")}
              </p>
            </div>

            <h2 className="mt-3.5 sm:mt-4 font-edo text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.05em] text-zinc-950 leading-[1.1]">
              {t("about.title")}
            </h2>

            <div className="mt-4 h-[2px] w-12 bg-zinc-950" />

            <div className="mt-6 sm:mt-8 space-y-4 font-times text-base sm:text-lg md:text-xl font-normal leading-relaxed text-zinc-800">
              <p>{t("about.paragraph1")}</p>
              <p>{t("about.paragraph2")}</p>
              <p>{t("about.paragraph3")}</p>
            </div>

            {/* Grid de Estatísticas */}
            <div className="mt-10 sm:mt-12 grid grid-cols-2 border-l border-t border-black/10 sm:grid-cols-4 bg-zinc-50/70">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * index, duration: 0.5 }}
                  className="border-b border-r border-black/10 px-3 sm:px-4 py-4 sm:py-6 text-center"
                >
                  <p className="font-edo text-2xl sm:text-3xl md:text-4xl text-zinc-950">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 sm:mt-1.5 font-sans text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.14em] text-zinc-500 font-medium">
                    {t(stat.key)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
