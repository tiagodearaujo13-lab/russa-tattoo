"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { STUDIO_CONFIG, getWhatsAppUrl } from "@/lib/constants/studio";
import { useLanguage } from "./LanguageProvider";
import type { Language } from "@/lib/i18n/translations";

const instagramUrl = STUDIO_CONFIG.instagram;
const navLinks = [
  { href: "#sobre", key: "header.about" },
  { href: "#estilos", key: "header.styles" },
  { href: "#piercing", key: "header.piercing" },
  { href: "#agenda", key: "header.booking" },
  { href: "#galeria", key: "header.gallery" },
  { href: "#faq", key: "header.faq" },
  { href: "#contacto", key: "header.contact" },
];

function InstagramMark({ className = "fill-current" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-4 w-4 ${className}`}>
      <path d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6a5.2 5.2 0 0 1-5.2 5.2H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2Zm-.1 2A3.1 3.1 0 0 0 4 7.1v9.8A3.1 3.1 0 0 0 7.1 20h9.8a3.1 3.1 0 0 0 3.1-3.1V7.1A3.1 3.1 0 0 0 16.9 4H7.1Zm9.65 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0-3-3Z" />
    </svg>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <div className="relative h-8 w-8 sm:h-9 sm:w-9 shrink-0 overflow-hidden rounded-full border border-white/20 ring-1 ring-white/10 shadow-xs bg-[#1A1A1A]">
        <Image
          src="/images/brand/russa-hero-crop.png"
          alt="Russa Tatuadora Logo"
          fill
          className="object-cover object-center"
          sizes="36px"
          priority
        />
      </div>
      <div className="flex flex-col">
        <span className="font-russa text-lg sm:text-xl font-bold tracking-[-0.01em] leading-tight text-white">
          RUSSA
        </span>
        <span className="font-tatuadora text-[7.5px] sm:text-[8px] uppercase tracking-[0.38em] text-[#DCDCDC]">
          TATUADORA
        </span>
      </div>
    </div>
  );
}

function LanguageSwitcher({
  language,
  setLanguage,
  compact = false,
}: {
  language: Language;
  setLanguage: (language: Language) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-center rounded-xs border border-white/20 bg-white/10 p-0.5 backdrop-blur-xs ${
        compact ? "h-7" : "h-8"
      }`}
      aria-label="Language selector"
    >
      {(["pt", "en"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLanguage(item)}
          aria-pressed={language === item}
          className={`h-full px-2 sm:px-2.5 font-tatuadora text-[9px] sm:text-[9.5px] font-semibold uppercase tracking-[0.16em] transition-all rounded-xs ${
            language === item
              ? "bg-white text-black shadow-xs"
              : "text-[#DCDCDC] hover:text-white"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-400 ${
        isScrolled
          ? "border-b border-[#CCCCCC]/20 bg-[#1A1A1A]/94 py-2.5 sm:py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-black/75 via-black/25 to-transparent py-4 sm:py-5"
      }`}
    >
      <div className="container mx-auto flex max-w-7xl items-center justify-between gap-3 sm:gap-4 px-4 sm:px-8">
        <Link href="/" aria-label="Russa Tatuadora" className="group">
          <Logo />
        </Link>

        {/* Desktop Navigation (Notebooks, Desktops) */}
        <nav className="hidden items-center gap-6 lg:gap-7 xl:gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative font-tatuadora text-[10px] xl:text-[10.5px] font-medium uppercase tracking-[0.22em] text-[#DCDCDC] transition-colors hover:text-white"
            >
              {t(link.key)}
              <span className="absolute -bottom-1.5 left-0 h-[1.5px] w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Right Actions (Desktop & Tablets) */}
        <div className="hidden items-center gap-3.5 sm:gap-4 lg:flex">
          {/* Seletor de Idioma em Destaque para Clientes Internacionais */}
          <LanguageSwitcher language={language} setLanguage={setLanguage} />

          <Link
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram @russatatuadora"
            className="text-[#CCCCCC] transition-colors hover:text-white p-1.5"
          >
            <InstagramMark className="fill-current" />
          </Link>

          <Button
            asChild
            className="btn-dotwork-outline text-[9px] sm:text-[9.5px] tracking-[0.2em] py-2 px-4 sm:px-5 min-h-9"
          >
            <Link href="#agenda">{t("header.book")}</Link>
          </Button>
        </div>

        {/* Mobile Header Actions (Smartphones & Tablets) */}
        <div className="flex items-center gap-2.5 lg:hidden">
          {/* Seletor de idioma acessível com 1 toque no Mobile */}
          <LanguageSwitcher language={language} setLanguage={setLanguage} compact={true} />

          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xs border border-white/20 text-white hover:bg-white/10 focus:ring-0"
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">{t("header.menu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(320px,88vw)] border-[#CCCCCC]/20 bg-[#1A1A1A] p-0 text-white"
            >
              <div className="flex h-full flex-col">
                <div className="border-b border-[#CCCCCC]/20 p-5 sm:p-6">
                  <Logo />
                </div>

                <div className="flex items-center justify-between border-b border-[#CCCCCC]/20 px-6 py-4">
                  <span className="font-tatuadora text-[9px] uppercase tracking-[0.25em] text-[#CCCCCC]">
                    {t("header.language")}
                  </span>
                  <LanguageSwitcher language={language} setLanguage={setLanguage} />
                </div>

                <nav className="flex flex-col gap-1 p-5 sm:p-6 overflow-y-auto">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="py-3 font-tatuadora text-xs uppercase tracking-[0.2em] text-[#DCDCDC] transition-colors hover:text-white"
                    >
                      {t(link.key)}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto space-y-3 border-t border-[#CCCCCC]/20 p-5 sm:p-6">
                  <Button
                    asChild
                    className="btn-dotwork-outline w-full min-h-11 text-xs tracking-[0.2em]"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <Link href="#agenda">{t("header.book")}</Link>
                  </Button>
                  <Button
                    asChild
                    className="btn-dotwork-primary w-full min-h-11 text-xs tracking-[0.2em]"
                  >
                    <Link href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                      <Phone className="mr-2 h-4 w-4" />
                      WhatsApp
                    </Link>
                  </Button>
                  <div className="flex items-center justify-center pt-2">
                    <Link
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="text-[#CCCCCC] hover:text-white transition-colors"
                    >
                      <InstagramMark className="fill-white h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
