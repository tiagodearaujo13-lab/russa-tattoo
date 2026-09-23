"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./LanguageProvider";

const BALACLAVA_WIDTH = "w-[300px] sm:w-[420px] md:w-[560px] lg:w-[680px] xl:w-[780px]";

function LeftLetters({ text, delay = 0.2 }: { text: string; delay?: number }) {
  return (
    <span className="inline-flex overflow-hidden">
      {text.split("").map((letter, i) => (
        <motion.span key={`left-${letter}-${i}`} initial={{ opacity: 0, x: -64, filter: "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} transition={{ duration: 0.85, delay: delay + i * 0.12, ease: [0.16, 1, 0.3, 1] }} className="inline-block">{letter}</motion.span>
      ))}
    </span>
  );
}

function RightLetters({ text, delay = 0.44 }: { text: string; delay?: number }) {
  return (
    <span className="inline-flex overflow-hidden">
      {text.split("").map((letter, i) => (
        <motion.span key={`right-${letter}-${i}`} initial={{ opacity: 0, x: 64, filter: "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} transition={{ duration: 0.85, delay: delay + i * 0.12, ease: [0.16, 1, 0.3, 1] }} className="inline-block">{letter}</motion.span>
      ))}
    </span>
  );
}

function TatuadoraLetters({ text, delay = 0.95 }: { text: string; delay?: number }) {
  return (
    <span className="inline-flex overflow-hidden">
      {text.split("").map((letter, i) => (
        <motion.span key={`tat-${letter}-${i}`} initial={{ opacity: 0, y: 10, scale: 0.88, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} transition={{ duration: 0.7, delay: delay + i * 0.08, ease: "easeOut" }} className="inline-block">{letter}</motion.span>
      ))}
    </span>
  );
}

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1A1A1A] text-white">
      {/* A cabeça termina na base do Hero para continuar diretamente no About. */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 flex -translate-x-1/2 select-none items-end justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }} className={`relative aspect-[2557/2428] animate-fade-in ${BALACLAVA_WIDTH}`}>
          <Image src="/images/brand/russa-hero-crop.png" alt="Olhar de Russa Tatuadora" fill priority sizes="(max-width: 639px) 300px, (max-width: 767px) 420px, (max-width: 1023px) 560px, (max-width: 1279px) 680px, 780px" className="object-contain object-bottom opacity-70 mix-blend-screen" />
        </motion.div>
      </div>

      {/* Vinheta suave: preserva o foco nas letras sem criar caixas duras. */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(26,26,26,0.38)_72%,#1A1A1A_100%)]" />
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-[#1A1A1A]/65 via-transparent to-[#1A1A1A]/85" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-5 pb-24 pt-28 text-center sm:px-8 md:px-12 lg:px-16">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }} className="mb-5 flex items-center justify-center gap-3 sm:mb-6">
          <span className="h-px w-6 bg-[#808080] sm:w-10" />
          <span className="font-tatuadora text-[9px] font-medium uppercase tracking-[0.38em] text-[#DCDCDC] sm:text-[10px]">{t("hero.eyebrow")} · ALGARVE, PORTUGAL</span>
          <span className="h-px w-6 bg-[#808080] sm:w-10" />
        </motion.div>

        <h1 className="select-none text-white">
          <span className="block overflow-hidden whitespace-nowrap font-russa text-6xl font-bold leading-[0.88] tracking-[-0.02em] text-[#9E9E9E] drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)] sm:text-8xl md:text-9xl lg:text-[9.5rem] xl:text-[10.5rem]">
            <LeftLetters text="RU" delay={0.25} /><RightLetters text="SSA" delay={0.42} />
          </span>
          <span className="mt-3 block font-tatuadora text-xs font-light uppercase tracking-[0.4em] text-[#E0E0E0] sm:text-base md:text-xl lg:text-2xl sm:tracking-[0.44em]"><TatuadoraLetters text="TATUADORA" delay={0.95} /></span>
        </h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.7 }} className="mx-auto mt-6 max-w-xl font-tatuadora text-sm font-normal leading-relaxed text-[#DCDCDC] sm:mt-8 sm:text-base md:text-lg">{t("hero.support")}</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, duration: 0.7 }} className="mt-8 flex max-w-md flex-col items-stretch justify-center gap-3.5 self-center sm:mt-10 sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
          <Button asChild className="btn-dotwork-primary min-h-[48px] px-8 text-xs font-semibold uppercase tracking-[0.2em]"><Link href="#agenda">{t("hero.book")}</Link></Button>
          <Button asChild className="btn-dotwork-outline min-h-[48px] px-8 text-xs font-semibold uppercase tracking-[0.2em]"><Link href="#galeria" className="group">{t("hero.portfolio")}<span aria-hidden="true" className="ml-2.5 inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span></Link></Button>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9, duration: 0.8 }} className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 sm:bottom-8">
        <Link href="#sobre" className="group flex flex-col items-center gap-2 font-tatuadora text-[10px] uppercase tracking-[0.3em] text-[#DCDCDC] transition-colors hover:text-white"><span>{t("hero.scroll")}</span><span className="relative h-10 w-px overflow-hidden bg-[#CCCCCC]/30"><span className="animate-scroll-line absolute inset-0 w-full bg-white" /></span></Link>
      </motion.div>
    </section>
  );
}
