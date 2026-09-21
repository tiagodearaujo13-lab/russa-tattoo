"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Mail, MessageCircle } from "lucide-react";
import InstagramIcon from "@/components/public/InstagramIcon";
import { getWhatsAppUrl, STUDIO_CONFIG } from "@/lib/constants/studio";
import { useLanguage } from "./LanguageProvider";

export default function ContactSection() {
  const { t } = useLanguage();
  const contactInfo = [
    {
      icon: MapPin,
      label: t("contact.address"),
      value: STUDIO_CONFIG.address.street,
      href: STUDIO_CONFIG.address.googleMapsUrl,
    },
    {
      icon: Clock,
      label: t("contact.hours"),
      value: t("contact.schedule"),
      href: null,
    },
    {
      icon: Phone,
      label: t("contact.phone"),
      value: process.env.NEXT_PUBLIC_STUDIO_PHONE || "+351 912 345 678",
      href: `tel:${(process.env.NEXT_PUBLIC_STUDIO_PHONE || "+351912345678").replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      label: t("contact.email"),
      value: "contacto@russatattoo.pt",
      href: "mailto:contacto@russatattoo.pt",
    },
  ];

  return (
    <section id="contacto" className="relative overflow-hidden bg-[#1A1A1A] py-24 text-white md:py-32 border-t border-[#CCCCCC]/20">
      <div className="container relative mx-auto max-w-7xl px-5 sm:px-8 md:px-12">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          {/* Informações de Contacto */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="font-tatuadora text-[9.5px] uppercase tracking-[0.3em] text-[#DCDCDC] font-medium">
              {t("contact.eyebrow")}
            </span>
            <h2 className="font-russa mt-4 text-3xl sm:text-4xl md:text-5xl uppercase tracking-[-0.01em] text-white font-bold">
              {t("contact.title")}
            </h2>
            <div className="mt-4 h-[1.5px] w-12 bg-white/30" />
            <p className="mb-10 mt-6 max-w-lg font-tatuadora text-base sm:text-lg leading-relaxed text-[#DCDCDC] font-light">
              {t("contact.support")}
            </p>

            <div className="mb-10 space-y-4">
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="flex items-start gap-4 border border-[#CCCCCC]/20 p-4 bg-[#222222]/70"
                >
                  <div className="shrink-0 border border-[#CCCCCC]/20 p-2.5 text-white">
                    <info.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="mb-1 font-tatuadora text-[9px] uppercase tracking-[0.16em] text-[#CCCCCC] font-medium">
                      {info.label}
                    </p>
                    {info.href ? (
                      <Link
                        href={info.href}
                        target={info.href.startsWith("http") ? "_blank" : undefined}
                        rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="font-tatuadora text-base sm:text-lg text-zinc-200 transition-colors hover:text-white"
                      >
                        {info.value}
                      </Link>
                    ) : (
                      <p className="font-tatuadora text-base sm:text-lg text-zinc-200">
                        {info.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="btn-dotwork-outline min-h-11 font-tatuadora tracking-[0.18em] uppercase text-xs font-semibold">
                <Link href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {t("contact.whatsapp")}
                </Link>
              </Button>
              <Button asChild className="btn-dotwork-outline min-h-11 font-tatuadora tracking-[0.18em] uppercase text-xs font-semibold">
                <Link href={STUDIO_CONFIG.instagram} target="_blank" rel="noopener noreferrer">
                  <InstagramIcon className="mr-2 h-4 w-4" />
                  {t("contact.instagram")}
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Google Maps Embed */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative min-h-[420px] overflow-hidden border border-white/[0.08] bg-[#141414]"
          >
            <iframe
              src={
                STUDIO_CONFIG.address.embedMapUrl ||
                "https://www.google.com/maps?q=Algarve+Portugal&output=embed"
              }
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 420 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t("contact.map")}
              className="grayscale transition-all duration-500 hover:grayscale-0"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
