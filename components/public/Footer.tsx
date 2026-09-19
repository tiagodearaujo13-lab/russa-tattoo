import Link from "next/link";
import { Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const instagramUrl = "https://www.instagram.com/russatatuadora/";
const footerLinks = [
  ["#sobre", "Sobre"], ["#estilos", "Estilos"], ["#piercing", "Piercing"], ["#agenda", "Agenda"], ["#galeria", "Galeria"], ["#faq", "FAQ"], ["#contacto", "Contacto"],
];

function InstagramMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white"><path d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6a5.2 5.2 0 0 1-5.2 5.2H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2Zm-.1 2A3.1 3.1 0 0 0 4 7.1v9.8A3.1 3.1 0 0 0 7.1 20h9.8a3.1 3.1 0 0 0 3.1-3.1V7.1A3.1 3.1 0 0 0 16.9 4H7.1Zm9.65 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0-0-6Z" /></svg>;
}

export default function Footer() {
  const year = new Date().getFullYear();
  return <footer className="border-t border-white/10 bg-black py-12">
    <div className="container mx-auto max-w-7xl px-4">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="text-center md:text-left"><Link href="/" className="font-display text-2xl lowercase leading-none text-white">russa<br /><span className="ml-3">tattoo</span></Link><p className="mt-3 font-sans text-xs font-light uppercase tracking-widest text-zinc-400">Arte que marca para sempre.</p></div>
        <nav className="flex max-w-xl flex-wrap justify-center gap-x-6 gap-y-3">{footerLinks.map(([href, label]) => <Link key={href} href={href} className="font-sans text-xs font-light uppercase tracking-widest text-zinc-400 hover:text-white">{label}</Link>)}</nav>
        <Link href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="border border-white/20 p-3 transition-colors hover:bg-white hover:[&>svg]:fill-black"><InstagramMark /></Link>
      </div>
      <Separator className="my-8 bg-white/10" />
      <div className="flex flex-col items-center justify-between gap-3 font-sans text-[10px] uppercase tracking-widest text-zinc-500 md:flex-row"><p>© {year} Russa Tattoo Studio.</p><p className="flex items-center gap-1">Feito com <Heart className="h-3 w-3" /> no Algarve</p><p>RGPD / LGPD</p></div>
    </div>
  </footer>;
}
