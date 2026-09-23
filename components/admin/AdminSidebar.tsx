"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  CalendarDays,
  ImageIcon,
  LogOut,
  Menu,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    href: "/admin",
    label: "Visão geral / Agendamentos",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/agenda",
    label: "Calendário & Horários",
    icon: CalendarDays,
  },
  {
    href: "/admin/galeria",
    label: "Galeria & Obras",
    icon: ImageIcon,
  },
];

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="border-b border-[#CCCCCC]/10 px-6 py-7">
        <Link
          href="/admin"
          className="font-russa text-2xl font-semibold tracking-wide text-white transition-colors hover:text-[#DCDCDC]"
          onClick={onLinkClick}
        >
          RUSSA
        </Link>
        <p className="mt-1 font-tatuadora text-[8px] uppercase tracking-[0.35em] text-[#808080]">Admin Panel</p>
      </div>

      <Separator className="bg-[#CCCCCC]/10" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 pt-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={`relative flex items-center gap-3 border-l-2 px-3 py-3 font-tatuadora text-[9px] uppercase tracking-[0.15em] transition-all ${
                isActive
                  ? "border-l-white bg-[#222222] text-white"
                  : "border-l-transparent text-[#8F8F8F] hover:bg-white/[0.03] hover:text-[#DCDCDC]"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-[#CCCCCC]/10" />

      {/* Bottom actions */}
      <div className="space-y-2 p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 border border-transparent px-3 py-3 font-tatuadora text-[9px] uppercase tracking-[0.15em] text-[#8F8F8F] transition-all hover:border-white/10 hover:text-[#DCDCDC]"
        >
          <ExternalLink className="h-4 w-4" />
          Ver Site
        </Link>
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="h-auto w-full justify-start gap-3 border border-white/10 px-3 py-3 font-tatuadora text-[9px] font-normal uppercase tracking-[0.15em] text-zinc-400 transition-colors hover:border-white/30 hover:bg-transparent hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Terminar Sessão
        </Button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden min-h-screen w-64 flex-col border-r border-[#CCCCCC]/10 bg-[#181818] lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border border-white/10 bg-[#222222] text-white hover:bg-white/10"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 border-r border-[#CCCCCC]/10 bg-[#181818] p-0 text-white"
          >
            <SidebarContent onLinkClick={() => setIsMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
