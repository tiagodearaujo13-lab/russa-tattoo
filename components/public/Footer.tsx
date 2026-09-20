"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { STUDIO_CONFIG } from "@/lib/constants/studio";
import { useLanguage } from "./LanguageProvider";

const instagramUrl = STUDIO_CONFIG.instagram;
const footerLinks = [
  ["#sobre", "header.about"],
  ["#estilos", "header.styles"],
  ["#piercing", "header.piercing"],
  ["#agenda", "header.booking"],
  ["#galeria", "header.gallery"],
  ["#faq", "header.faq"],
  ["#contacto", "header.contact"],
];

function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6a5.2 5.2 0 0 1-5.2 5.2H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2Zm-.1 2A3.1 3.1 0 0 0 4 7.1v9.8A3.1 3.1 0 0 0 7.1 20h9.8a3.1 3.1 0 0 0 3.1-3.1V7.1A3.1 3.1 0 0 0 16.9 4H7.1Zm9.65 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0-3-3Z" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a] py-14 text-white md:py-20">
      <div className="container mx-auto max-w-7xl px-6 md:px-12">
        {/* Giant Watermark */}
        <div className="overflow-hidden select-none pointer-events-none">
          <p className="font-edo text-5xl uppercase tracking-[0.14em] text-white/5 md:text-7xl lg:text-8xl">
            Russa Tattoo Studio
          </p>
        </div>

        <Separator className="my-10 bg-white/10" />

        {/* Main Footer Row */}
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          {/* Brand Info with Official Logo */}
          <div className="flex items-center gap-4">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/20 ring-1 ring-white/10">
              <Image
                src="/images/logo.jpg"
                alt="Russa Tattoo Studio Logo"
                fill
                className="object-cover"
                sizes="44px"
              />
            </div>
            <div>
              <Link href="/" className="font-edo text-2xl tracking-[0.14em] font-normal text-white hover:text-zinc-300 transition-colors">
                RUSSA
              </Link>
              <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-zinc-400">
                {t("footer.tagline")}
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex max-w-2xl flex-wrap gap-x-7 gap-y-3">
            {footerLinks.map(([href, key]) => (
              <Link
                key={href}
                href={href}
                className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-white"
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Social & Back to Top */}
          <div className="flex items-center gap-4">
            <Link
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @russatatuadora"
              className="flex h-10 w-10 items-center justify-center rounded-xs border border-white/20 text-zinc-400 transition-all hover:border-white hover:bg-white hover:text-black"
            >
              <InstagramMark />
            </Link>
            <Link
              href="#hero"
              className="group flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-white"
            >
              <span>{t("footer.backToTop")}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xs border border-white/20 transition-all group-hover:border-white group-hover:bg-white group-hover:text-black">
                <ArrowUp className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        {/* Copyright & Privacy */}
        <div className="flex flex-col items-center justify-between gap-3 font-sans text-[10px] uppercase tracking-[0.2em] text-zinc-400 md:flex-row">
          <p>© {year} Russa Tattoo Studio · Algarve, Portugal.</p>
          <p className="text-zinc-400">Fine Line · Botânica · Body Piercing</p>
          <p>{t("footer.rgpd")}</p>
        </div>
      </div>
    </footer>
  );
}
