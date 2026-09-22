"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gem, Shield, Sparkles } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const piercingTypes = [
  { nameKey: "piercing.ear", descriptionKey: "piercing.earDescription", price: "Desde 25€" },
  { nameKey: "piercing.nose", descriptionKey: "piercing.noseDescription", price: "Desde 30€" },
  { nameKey: "piercing.lip", descriptionKey: "piercing.lipDescription", price: "Desde 30€" },
  { nameKey: "piercing.brow", descriptionKey: "piercing.browDescription", price: "Desde 30€" },
  { nameKey: "piercing.navel", descriptionKey: "piercing.navelDescription", price: "Desde 35€" },
  { nameKey: "piercing.microdermal", descriptionKey: "piercing.microdermalDescription", price: "Desde 40€" },
];

function languageAwarePrice(price: string, _label: string, t: (key: string) => string) {
  return price.replace("Desde", t("language.priceFrom") === "language.priceFrom" ? "From" : t("language.priceFrom"));
}

export default function PiercingSection() {
  const { t } = useLanguage();

  return (
    <section id="piercing" className="relative overflow-hidden bg-gradient-to-b from-[#D1D1D1] to-[#CCCCCC] py-24 md:py-32 text-[#1A1A1A] border-t border-[#1A1A1A]/15">
      <div
        className="absolute inset-0 bg-cover bg-center grayscale opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=85')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#D1D1D1] via-[#CCCCCC]/90 to-[#CCCCCC] pointer-events-none" />

      <div className="container relative mx-auto max-w-7xl px-5 sm:px-8 md:px-12">
        <div className="grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 inline-flex min-h-11 items-center gap-3 border border-[#1A1A1A]/20 px-3.5 py-2 font-tatuadora text-[9.5px] font-medium uppercase tracking-[0.25em] text-[#1A1A1A] bg-[#1A1A1A]/20">
              <Gem className="h-4 w-4 text-[#1A1A1A]" /> {t("piercing.eyebrow")}
            </div>

            <h2 className="font-russa text-3xl sm:text-4xl md:text-5xl uppercase leading-tight tracking-[-0.01em] text-[#1A1A1A] font-bold">
              {t("piercing.title")}
            </h2>

            <div className="mt-4 h-[1.5px] w-12 bg-[#1A1A1A]/20" />

            <p className="mb-8 mt-6 max-w-lg font-tatuadora text-base sm:text-lg leading-relaxed text-[#222222] font-light">
              {t("piercing.support")}
            </p>

            <div className="mb-10 flex flex-wrap gap-3">
              <span className="inline-flex min-h-11 items-center gap-2 border border-[#1A1A1A]/20 px-3.5 py-2 font-tatuadora text-[9px] uppercase tracking-[0.16em] text-[#1A1A1A] bg-white/30">
                <Shield className="h-3.5 w-3.5 text-[#1A1A1A]" /> {t("piercing.titanium")}
              </span>
              <span className="inline-flex min-h-11 items-center gap-2 border border-[#1A1A1A]/20 px-3.5 py-2 font-tatuadora text-[9px] uppercase tracking-[0.16em] text-[#1A1A1A] bg-white/30">
                <Sparkles className="h-3.5 w-3.5 text-[#1A1A1A]" /> {t("piercing.sterile")}
              </span>
            </div>

            <Button asChild className="min-h-11 border border-[#1A1A1A] bg-[#1A1A1A] px-8 font-tatuadora text-[#CCCCCC] hover:bg-[#222222]">
              <Link href="#agenda">{t("piercing.book")}</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="border-t border-[#1A1A1A]/20"
          >
            {piercingTypes.map((piercing, index) => (
              <motion.div
                key={piercing.nameKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * index, duration: 0.4 }}
                className="group border-b border-[#1A1A1A]/20 py-5 transition-colors hover:bg-white/[0.02] px-2"
              >
                <div className="flex items-baseline gap-3">
                  <h3 className="shrink-0 font-tatuadora text-lg font-light sm:text-xl uppercase tracking-[0.08em] text-[#1A1A1A] transition-colors group-hover:text-[#222222]">
                    {t(piercing.nameKey)}
                  </h3>
                  <span className="mb-1 h-px flex-1 border-b border-dotted border-[#1A1A1A]/20" />
                  <span className="shrink-0 font-tatuadora text-lg font-light tracking-[0.08em] text-[#1A1A1A]">
                    {languageAwarePrice(piercing.price, t("piercing.eyebrow"), t)}
                  </span>
                </div>
                <p className="mt-2 max-w-md font-tatuadora text-sm leading-relaxed text-[#222222] font-light">
                  {t(piercing.descriptionKey)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
