"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Mail, MessageCircle } from "lucide-react";
import InstagramIcon from "@/components/public/InstagramIcon";

const contactInfo = [
  {
    icon: MapPin,
    label: "Morada",
    value: process.env.NEXT_PUBLIC_STUDIO_ADDRESS || "Rua do Estúdio, 42 — Faro, Algarve",
    href: "https://maps.google.com/?q=Faro+Algarve+Portugal",
  },
  {
    icon: Clock,
    label: "Horário",
    value: "Seg–Sex: 10h–19h | Sáb: 10h–15h",
    href: null,
  },
  {
    icon: Phone,
    label: "Telefone",
    value: process.env.NEXT_PUBLIC_STUDIO_PHONE || "+351 912 345 678",
    href: `tel:${(process.env.NEXT_PUBLIC_STUDIO_PHONE || "+351912345678").replace(/\s/g, "")}`,
  },
  {
    icon: Mail,
    label: "E-mail",
    value: "contacto@russatattoo.pt",
    href: "mailto:contacto@russatattoo.pt",
  },
];

export default function ContactSection() {
  return (
    <section id="contacto" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-white/3 to-transparent" />

      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-white text-sm font-semibold tracking-widest uppercase">
              Contacto
            </span>
            <h2 className="font-display text-4xl md:text-5xl mt-3 mb-6">
              Visite o Estúdio
            </h2>
            <p className="text-foreground/60 leading-relaxed mb-10 max-w-lg">
              Estamos no coração do Algarve. Venha conhecer o espaço, conversar
              sobre a sua ideia ou simplesmente tomar um café.
            </p>

            <div className="space-y-6 mb-10">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  <div className="p-2.5 rounded-sm bg-white/10 text-white shrink-0">
                    <info.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40 uppercase tracking-wider mb-0.5">
                      {info.label}
                    </p>
                    {info.href ? (
                      <Link
                        href={info.href}
                        target={info.href.startsWith("http") ? "_blank" : undefined}
                        rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-foreground/80 hover:text-white transition-colors"
                      >
                        {info.value}
                      </Link>
                    ) : (
                      <p className="text-foreground/80">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="border border-white bg-transparent text-white font-semibold rounded-sm hover:bg-white hover:text-black"
              >
                <Link
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_STUDIO_WHATSAPP || "351912345678"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Link>
              </Button>
              <Button
                asChild
                className="border border-white bg-transparent text-white font-semibold rounded-sm hover:bg-white hover:text-black"
              >
                <Link
                  href={"https://www.instagram.com/russatatuadora/"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon className="w-4 h-4 mr-2" />
                  Instagram
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-sm overflow-hidden glass min-h-[400px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d51370.36489018003!2d-7.9660!3d37.0194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0d7e0e7e7e7e7e%3A0x0!2sFaro%2C%20Portugal!5e0!3m2!1spt-BR!2spt!4v1700000000000!5m2!1spt-BR!2spt"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 400 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização do Russa Tattoo Studio"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
