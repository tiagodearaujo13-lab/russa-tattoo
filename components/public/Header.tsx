"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const instagramUrl = "https://www.instagram.com/russatatuadora/";
const navLinks = [
  { href: "#sobre", label: "Sobre" },
  { href: "#estilos", label: "Estilos" },
  { href: "#piercing", label: "Piercing" },
  { href: "#agenda", label: "Agenda" },
  { href: "#galeria", label: "Galeria" },
  { href: "#faq", label: "FAQ" },
  { href: "#contacto", label: "Contacto" },
];

function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
      <path d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6a5.2 5.2 0 0 1-5.2 5.2H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2Zm-.1 2A3.1 3.1 0 0 0 4 7.1v9.8A3.1 3.1 0 0 0 7.1 20h9.8a3.1 3.1 0 0 0 3.1-3.1V7.1A3.1 3.1 0 0 0 16.9 4H7.1Zm9.65 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  );
}

function Logo() {
  return (
    <span className="font-display text-xl leading-[0.8] text-white lowercase">
      <span className="block">russa</span>
      <span className="block ml-3">tattoo</span>
    </span>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 transition-all ${isScrolled ? "bg-black/95 py-3 backdrop-blur-md" : "bg-black/35 py-5"}`}
    >
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-4">
        <Link href="/" aria-label="Russa Tattoo Studio"><Logo /></Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="font-sans text-xs font-light uppercase tracking-widest text-zinc-300 transition-colors hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <Link href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-opacity hover:opacity-60"><InstagramMark /></Link>
          <Button asChild className="rounded-sm border border-white bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:bg-white hover:text-black">
            <Link href="#agenda">Agendar</Link>
          </Button>
        </div>

        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="rounded-sm border border-white/20 text-white"><Menu className="h-5 w-5" /><span className="sr-only">Menu</span></Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] border-white/10 bg-black p-0">
            <div className="flex h-full flex-col">
              <div className="border-b border-white/10 p-6"><Logo /></div>
              <nav className="flex flex-col gap-1 p-6">
                {navLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setIsMobileOpen(false)} className="px-2 py-3 font-sans text-xs font-light uppercase tracking-widest text-zinc-300 hover:text-white">{link.label}</Link>)}
              </nav>
              <div className="mt-auto space-y-5 border-t border-white/10 p-6">
                <Button asChild className="w-full rounded-sm border border-white bg-transparent py-3 text-xs font-semibold uppercase tracking-widest text-white hover:bg-white hover:text-black" onClick={() => setIsMobileOpen(false)}><Link href="#agenda">Agendar sessão</Link></Button>
                <div className="flex items-center justify-center gap-5">
                  <Link href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramMark /></Link>
                  <Link href={`https://wa.me/${process.env.NEXT_PUBLIC_STUDIO_WHATSAPP || "351912345678"}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-white"><Phone className="h-5 w-5" /></Link>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  );
}
