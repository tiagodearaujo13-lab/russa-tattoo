"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Mail, MessageCircle, ExternalLink } from "lucide-react";
import InstagramIcon from "@/components/public/InstagramIcon";
import { STUDIO_CONFIG, STUDIO_WHATSAPP_NUMBER, getWhatsAppUrl } from "@/lib/constants/studio";
import { useLanguage } from "./LanguageProvider";

export default function ContactSection() {
  const { t } = useLanguage();
  const hasWhatsApp = STUDIO_WHATSAPP_NUMBER.length > 0;

  const contactInfo = [
    {
      icon: MapPin,
      label: t("contact.address"),
      customContent: (
        <div>
          <p className="font-tatuadora text-base sm:text-lg text-zinc-100 font-normal">
            {STUDIO_CONFIG.location.street}
          </p>
          <p className="font-tatuadora text-xs sm:text-sm text-[#CCCCCC]/80 font-light mt-0.5">
            {STUDIO_CONFIG.location.postalCode} {STUDIO_CONFIG.location.parish} — Algarve, Portugal
          </p>
        </div>
      ),
      href: STUDIO_CONFIG.maps.directSearchUrl,
    },
    {
      icon: Clock,
      label: t("contact.hours"),
      customContent: (
        <p className="font-tatuadora text-base sm:text-lg text-zinc-200">
          {t("contact.schedule")}
        </p>
      ),
      href: null,
    },
    {
      icon: Phone,
      label: t("contact.phone"),
      customContent: (
        <p className="font-tatuadora text-base sm:text-lg text-zinc-200">
          {STUDIO_CONFIG.contact.phoneDisplay}
        </p>
      ),
      href: `tel:${STUDIO_CONFIG.contact.phone.replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      label: t("contact.email"),
      customContent: (
        <p className="font-tatuadora text-base sm:text-lg text-zinc-200">
          {STUDIO_CONFIG.email}
        </p>
      ),
      href: `mailto:${STUDIO_CONFIG.email}`,
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
                        className="block transition-colors hover:text-white"
                      >
                        {info.customContent}
                      </Link>
                    ) : (
                      info.customContent
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {hasWhatsApp && (
                <Button asChild className="btn-dotwork-outline min-h-11 font-tatuadora tracking-[0.18em] uppercase text-xs font-semibold">
                  <Link href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t("contact.whatsapp")}
                  </Link>
                </Button>
              )}
              <Button asChild className="btn-dotwork-outline min-h-11 font-tatuadora tracking-[0.18em] uppercase text-xs font-semibold">
                <Link href={STUDIO_CONFIG.contact.instagramUrl} target="_blank" rel="noopener noreferrer">
                  <InstagramIcon className="mr-2 h-4 w-4" />
                  {t("contact.instagram")}
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Google Maps Embed — Tratamento Monocromático de Luxo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-3"
          >
            <div className="relative aspect-video sm:aspect-[16/9] w-full overflow-hidden border border-[#CCCCCC]/20 bg-[#141414] group shadow-2xl">
              <iframe
                src={STUDIO_CONFIG.maps.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t("contact.map")}
                className="h-full w-full grayscale invert contrast-[1.2] opacity-80 transition-all duration-700 group-hover:opacity-100"
              />
              <div className="absolute bottom-4 right-4 z-10">
                <Link
                  href={STUDIO_CONFIG.maps.directSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/20 bg-black/85 px-4 py-2 font-tatuadora text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
                >
                  <span>Como Chegar</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
            <p className="font-tatuadora text-[10px] uppercase tracking-[0.18em] text-[#808080] text-right">
              {STUDIO_CONFIG.location.formattedAddress}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
