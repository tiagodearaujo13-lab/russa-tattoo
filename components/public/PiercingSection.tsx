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
    <section id="piercing" className="relative overflow-hidden bg-[#222222] py-24 md:py-32 text-white border-t border-[#CCCCCC]/20">
      <div
        className="absolute inset-0 bg-cover bg-center grayscale opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=85')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#222222] via-[#222222]/90 to-[#222222] pointer-events-none" />

      <div className="container relative mx-auto max-w-7xl px-5 sm:px-8 md:px-12">
        <div className="grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 inline-flex min-h-11 items-center gap-3 border border-[#CCCCCC]/20 px-3.5 py-2 font-tatuadora text-[9.5px] font-medium uppercase tracking-[0.25em] text-[#DCDCDC] bg-white/5">
              <Gem className="h-4 w-4 text-white" /> {t("piercing.eyebrow")}
            </div>

            <h2 className="font-russa text-3xl sm:text-4xl md:text-5xl uppercase leading-tight tracking-[-0.01em] text-white font-bold">
              {t("piercing.title")}
            </h2>

            <div className="mt-4 h-[1.5px] w-12 bg-white/30" />

            <p className="mb-8 mt-6 max-w-lg font-times text-base sm:text-lg leading-relaxed text-[#DCDCDC] font-light">
              {t("piercing.support")}
            </p>

            <div className="mb-10 flex flex-wrap gap-3">
              <span className="inline-flex min-h-11 items-center gap-2 border border-[#CCCCCC]/20 px-3.5 py-2 font-tatuadora text-[9px] uppercase tracking-[0.16em] text-[#DCDCDC] bg-white/5">
                <Shield className="h-3.5 w-3.5 text-white" /> {t("piercing.titanium")}
              </span>
              <span className="inline-flex min-h-11 items-center gap-2 border border-[#CCCCCC]/20 px-3.5 py-2 font-tatuadora text-[9px] uppercase tracking-[0.16em] text-[#DCDCDC] bg-white/5">
                <Sparkles className="h-3.5 w-3.5 text-white" /> {t("piercing.sterile")}
              </span>
            </div>

            <Button asChild className="btn-dotwork-outline min-h-11 px-8">
              <Link href="#agenda">{t("piercing.book")}</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="border-t border-[#CCCCCC]/20"
          >
            {piercingTypes.map((piercing, index) => (
              <motion.div
                key={piercing.nameKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * index, duration: 0.4 }}
                className="group border-b border-[#CCCCCC]/20 py-5 transition-colors hover:bg-white/[0.02] px-2"
              >
                <div className="flex items-baseline gap-3">
                  <h3 className="shrink-0 font-russa text-lg sm:text-xl uppercase tracking-[0.02em] text-white font-bold transition-colors group-hover:text-[#DCDCDC]">
                    {t(piercing.nameKey)}
                  </h3>
                  <span className="mb-1 h-px flex-1 border-b border-dotted border-white/20" />
                  <span className="shrink-0 font-russa text-lg font-bold text-white">
                    {languageAwarePrice(piercing.price, t("piercing.eyebrow"), t)}
                  </span>
                </div>
                <p className="mt-2 max-w-md font-times text-sm leading-relaxed text-[#CCCCCC] font-light">
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
