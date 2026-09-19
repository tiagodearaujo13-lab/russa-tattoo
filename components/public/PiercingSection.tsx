"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gem, Shield, Sparkles } from "lucide-react";

const piercingTypes = [
  { name: "Orelha", description: "Lóbulo, hélix, tragus, daith, conch e industrial", price: "Desde 25€" },
  { name: "Nariz", description: "Nostril, septum e bridge", price: "Desde 30€" },
  { name: "Lábio", description: "Labret, medusa, snake bites e monroe", price: "Desde 30€" },
  { name: "Sobrancelha", description: "Eyebrow piercing clássico e anti-eyebrow", price: "Desde 30€" },
  { name: "Umbigo", description: "Navel piercing clássico e invertido", price: "Desde 35€" },
  { name: "Microdermal", description: "Implantes subdérmicos em qualquer zona", price: "Desde 40€" },
];

export default function PiercingSection() {
  return (
    <section id="piercing" className="py-24 md:py-32 relative overflow-hidden">
      {/* Monochrome accent background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/3 to-transparent" />

      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/10 border border-white/20 text-white text-sm font-medium mb-6">
              <Gem className="w-4 h-4" />
              Piercing Profissional
            </div>

            <h2 className="font-display text-4xl md:text-5xl mb-6">
              <span className="text-white">Piercing</span> com
              <br />
              Arte & Segurança
            </h2>

            <p className="text-foreground/60 leading-relaxed mb-8 max-w-lg">
              Além da tatuagem, oferecemos serviços de piercing com jóias de
              titânio grau implante e aço cirúrgico. Todo o procedimento é
              realizado com materiais esterilizados e descartáveis.
            </p>

            <div className="flex items-center gap-6 mb-10">
              <div className="flex items-center gap-2 text-sm text-foreground/50">
                <Shield className="w-4 h-4 text-white" />
                Materiais Esterilizados
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/50">
                <Sparkles className="w-4 h-4 text-white" />
                Jóias de Titânio
              </div>
            </div>

            <Button
              asChild
              className="border border-white bg-transparent text-white hover:bg-white hover:text-black font-semibold px-8 rounded-sm transition-all hover:scale-105"
            >
              <Link href="#agenda">Agendar Piercing</Link>
            </Button>
          </motion.div>

          {/* Piercing Types Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-4"
          >
            {piercingTypes.map((piercing, index) => (
              <motion.div
                key={piercing.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * index, duration: 0.4 }}
                className="glass rounded-sm p-5 group hover:border-white/20 transition-all duration-300 hover-lift"
              >
                <h3 className="font-display text-lg text-foreground group-hover:text-white transition-colors">
                  {piercing.name}
                </h3>
                <p className="text-xs text-foreground/40 mt-1 mb-3 line-clamp-2">
                  {piercing.description}
                </p>
                <span className="text-sm font-semibold text-white">
                  {piercing.price}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
