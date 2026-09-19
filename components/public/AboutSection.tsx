"use client";

import { motion } from "framer-motion";
import { Award, Clock, Heart, Users } from "lucide-react";

const stats = [
  { icon: Clock, value: "8+", label: "Anos de Experiência" },
  { icon: Users, value: "1500+", label: "Clientes Satisfeitos" },
  { icon: Heart, value: "3000+", label: "Tatuagens Realizadas" },
  { icon: Award, value: "100%", label: "Materiais Esterilizados" },
];

export default function AboutSection() {
  return (
    <section id="sobre" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/3 rounded-sm blur-3xl" />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-sm overflow-hidden aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1590246814883-57835158a1d3?auto=format&fit=crop&w=1200&q=85"
                alt="Russa Tattoo Artist no estúdio"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -bottom-6 -right-6 glass rounded-sm p-6 border-white/15"
            >
              <p className="font-display text-3xl text-white">8+</p>
              <p className="text-sm text-foreground/60">Anos de Arte</p>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-white text-sm font-semibold tracking-widest uppercase">
              Sobre
            </span>
            <h2 className="font-display text-4xl md:text-5xl mt-3 mb-6">
              Conheça a Russa
            </h2>
            <div className="space-y-4 text-foreground/70 leading-relaxed">
              <p>
                Com mais de 8 anos de dedicação à arte da tatuagem, a Russa
                transformou a sua paixão num estúdio de referência no Algarve.
                Cada design é criado exclusivamente para si — nunca repetido,
                sempre único.
              </p>
              <p>
                Especializada em Fine Line, Blackwork e estilos minimalistas, a
                Russa combina precisão técnica com sensibilidade artística para
                criar peças que contam histórias na pele.
              </p>
              <p>
                O estúdio segue rigorosos protocolos de higiene e
                biossegurança, utilizando apenas materiais descartáveis e
                equipamentos esterilizados por autoclave.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-10">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="glass rounded-sm p-4 text-center group hover:border-white/15 transition-all duration-300"
                >
                  <stat.icon className="w-5 h-5 text-white mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-display text-2xl text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-foreground/50 mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
