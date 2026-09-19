"use client";

import { motion } from "framer-motion";
import { Compass, Droplets, Feather, Hexagon, Minimize2, Skull } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const styles = [
  { icon: Compass, name: "Old School", image: "https://images.unsplash.com/photo-1590246814883-57c511c5c5d0?q=80&w=600&auto=format&fit=crop" },
  { icon: Feather, name: "Realistic", image: "https://images.unsplash.com/photo-1581783898382-80983a5e3e1e?q=80&w=600&auto=format&fit=crop" },
  { icon: Hexagon, name: "Japanese", image: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?q=80&w=600&auto=format&fit=crop" },
  { icon: Droplets, name: "Watercolor", image: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=600&auto=format&fit=crop" },
  { icon: Skull, name: "Maori", image: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=600&auto=format&fit=crop" },
  { icon: Minimize2, name: "Minimalist", image: "https://images.unsplash.com/photo-1604431696980-07e518647610?q=80&w=600&auto=format&fit=crop" },
];

export default function FeaturesStyles() {
  return (
    <section id="estilos" className="bg-black py-24 md:py-32">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 text-center">
          <p className="font-sans text-xs font-light uppercase tracking-[0.3em] text-zinc-400">Especialidades</p>
          <h2 className="mt-4 font-display text-4xl lowercase text-white md:text-6xl">art tattoo</h2>
          <p className="mx-auto mt-5 max-w-xl font-sans text-sm font-light leading-relaxed text-zinc-300">Seis linguagens, uma assinatura. Escolha a direção para a sua próxima peça.</p>
        </motion.div>
        <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 md:grid-cols-3">
          {styles.map((style, index) => (
            <ScrollReveal key={style.name} direction={index % 3 === 0 ? "left" : index % 3 === 1 ? "bottom" : "right"} delay={index * 80} className="group relative aspect-square overflow-hidden border border-white/10 bg-[#0a0a0a] transition-all duration-500 hover:-translate-y-2 hover:border-white/40 hover:bg-gradient-to-b hover:from-zinc-900 hover:to-black hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.07)]">
              <img src={style.image} alt={`Tatuagem ${style.name}`} className="h-full w-full object-cover grayscale opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                <style.icon className="mb-3 h-5 w-5 text-white" />
                <h3 className="font-display text-2xl lowercase text-white md:text-3xl">{style.name}</h3>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
