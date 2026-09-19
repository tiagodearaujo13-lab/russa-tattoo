"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const actionClass = "rounded-sm border border-white bg-transparent px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black";

export default function HeroSection() {
  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center grayscale" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1920&q=85')" }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.85))]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="mb-8 font-sans text-xs font-light uppercase tracking-[0.35em] text-zinc-300">Algarve · Portugal</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="font-display text-6xl lowercase leading-none text-white sm:text-8xl md:text-9xl">tattoo<br />studio</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="mx-auto mb-10 mt-8 max-w-xl font-sans text-sm font-light leading-relaxed text-zinc-300 md:text-base">Tatuagem e piercing pensados para a sua pele. Traço, matéria e identidade em cada peça.</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }} className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild className={actionClass}><Link href="#agenda">Agendar sessão</Link></Button>
          <Button asChild variant="outline" className={actionClass}><Link href="#galeria">Ver portfólio</Link></Button>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <Link href="#sobre" className="flex flex-col items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-white"><span>Explorar</span><motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}><ChevronDown className="h-5 w-5" /></motion.div></Link>
      </motion.div>
    </section>
  );
}
