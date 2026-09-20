"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./LanguageProvider";

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1920&q=85",
    alt: "Fine line tattoo arte delicada",
  },
  {
    url: "https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=1920&q=85",
    alt: "Artista tatuadora no estúdio",
  },
  {
    url: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=1920&q=85",
    alt: "Tatuagem botânica e geométrica",
  },
];

// Letras da esquerda para a direita (R, U)
function LeftLetters({ text, delay = 0.2 }: { text: string; delay?: number }) {
  return (
    <span className="inline-flex overflow-hidden">
      {text.split("").map((letter, i) => (
        <motion.span
          key={`left-${letter}-${i}`}
          initial={{ opacity: 0, x: -64, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.75,
            delay: delay + i * 0.12,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}

// Letras da direita para a esquerda (S, S, A)
function RightLetters({ text, delay = 0.44 }: { text: string; delay?: number }) {
  return (
    <span className="inline-flex overflow-hidden">
      {text.split("").map((letter, i) => (
        <motion.span
          key={`right-${letter}-${i}`}
          initial={{ opacity: 0, x: 64, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.75,
            delay: delay + i * 0.12,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}

// STUDIO aparecendo letra por letra como tatuagem na pele
function TattooLetters({ text, delay = 1.1 }: { text: string; delay?: number }) {
  return (
    <span className="inline-flex overflow-hidden tracking-[0.25em] sm:tracking-[0.3em]">
      {text.split("").map((letter, i) => (
        <motion.span
          key={`tattoo-${letter}-${i}`}
          initial={{
            opacity: 0,
            y: 8,
            scale: 0.85,
            filter: "blur(6px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.65,
            delay: delay + i * 0.1,
            ease: "easeOut",
          }}
          className="inline-block text-zinc-400 font-light"
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(
      () => setActiveSlide((current) => (current + 1) % heroImages.length),
      6000
    );
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const moveSlide = (direction: 1 | -1) =>
    setActiveSlide((current) => (current + direction + heroImages.length) % heroImages.length);

  return (
    <section
      id="hero"
      className="relative flex min-h-[92vh] sm:min-h-screen items-center overflow-hidden bg-[#070708] text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Carrossel com 3 imagens e overlay de alto contraste */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <AnimatePresence mode="sync">
          {heroImages.map(
            (image, index) =>
              index === activeSlide && (
                <motion.div
                  key={image.url}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 0.38, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover grayscale contrast-125 brightness-75"
                  />
                </motion.div>
              )
          )}
        </AnimatePresence>

        {/* Gradientes escuros com alto contraste para garantir leitura perfeita da tipografia branca */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070708] via-[#070708]/85 to-[#070708]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(20,20,22,0.4)_0%,#070708_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#070708] via-[#070708]/70 to-transparent" />
      </div>

      {/* Conteúdo Principal — Responsivo para Mobile, Tablet e Desktop */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16 pt-28 pb-20 sm:pt-36 sm:pb-28">
        <div className="max-w-4xl">
          {/* Eyebrow / Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="h-[1px] w-6 sm:w-10 bg-zinc-500" />
            <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-zinc-400 font-medium">
              {t("hero.eyebrow")} · ALGARVE, PORTUGAL
            </span>
          </motion.div>

          {/* Título com Mistura de 3 Fontes Artísticas e Animação Direcional */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[8.5rem] leading-[0.92] text-white">
            {/* RUSSA: Fonte Edo SZ (RU da esquerda + SSA da direita) */}
            <span className="block overflow-hidden whitespace-nowrap font-edo tracking-[0.06em]">
              <LeftLetters text="RU" delay={0.25} />
              <RightLetters text="SSA" delay={0.42} />
            </span>

            {/* TATTOO: Segunda Fonte (Cormorant Garamond itálica, de baixo para cima) */}
            <motion.span
              initial={{ opacity: 0, y: 65 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.82,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="block font-serif-cormorant font-normal italic text-zinc-100 mt-1 tracking-[0.03em]"
            >
              TATTOO
            </motion.span>

            {/* STUDIO: Terceira Fonte (Original Montserrat letra por letra como tatuagem) */}
            <span className="block mt-1 sm:mt-2 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-light">
              <TattooLetters text="STUDIO" delay={1.2} />
            </span>
          </h1>

          {/* Texto de Apoio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.7 }}
            className="mt-6 sm:mt-8 max-w-xl font-times text-sm sm:text-base md:text-lg font-normal leading-relaxed text-zinc-300"
          >
            {t("hero.support")}
          </motion.p>

          {/* Botões de Ação de Alto Contraste */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.7 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 max-w-md sm:max-w-none"
          >
            <Button
              asChild
              className="btn-dotwork-primary min-h-[48px] px-8 text-xs uppercase tracking-[0.2em] font-semibold"
            >
              <Link href="#agenda">{t("hero.book")}</Link>
            </Button>
            <Button
              asChild
              className="btn-dotwork-outline min-h-[48px] px-8 text-xs uppercase tracking-[0.2em] font-semibold"
            >
              <Link href="#galeria" className="group">
                {t("hero.portfolio")}
                <span
                  aria-hidden="true"
                  className="ml-2.5 inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                >
                  ↗
                </span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Controles do Carrossel de 3 Imagens (Canto inferior esquerdo) */}
      <div className="absolute bottom-6 sm:bottom-8 left-5 sm:left-8 md:left-12 z-20 flex items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={() => moveSlide(-1)}
          aria-label="Slide anterior"
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xs border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-sans text-[11px] font-medium tracking-[0.22em] text-zinc-300">
          0{activeSlide + 1} / 0{heroImages.length}
        </span>
        <button
          type="button"
          onClick={() => moveSlide(1)}
          aria-label="Próximo slide"
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xs border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Indicador de Scroll Suave (Canto inferior direito) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
        className="hidden sm:block absolute bottom-8 right-6 md:right-12 z-20"
      >
        <Link
          href="#sobre"
          className="group flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.25em] text-zinc-400 transition-colors hover:text-white"
        >
          <span>{t("hero.scroll")}</span>
          <span className="relative h-12 w-px overflow-hidden bg-white/20">
            <span className="animate-scroll-line absolute inset-0 w-full bg-white" />
          </span>
        </Link>
      </motion.div>
    </section>
  );
}
