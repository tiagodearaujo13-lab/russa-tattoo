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
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/agenda",
    label: "Agenda",
    icon: CalendarDays,
  },
  {
    href: "/admin/galeria",
    label: "Galeria",
    icon: ImageIcon,
  },
];

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6">
        <Link
          href="/admin"
          className="font-display text-2xl text-white hover:text-white-light transition-colors"
          onClick={onLinkClick}
        >
          Russa Tattoo
        </Link>
        <p className="text-xs text-foreground/30 mt-1">Painel Admin</p>
      </div>

      <Separator className="bg-white/5" />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-foreground/50 hover:text-foreground hover:bg-white/5"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-white/5" />

      {/* Bottom actions */}
      <div className="p-4 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-foreground/40 hover:text-foreground hover:bg-white/5 transition-all"
        >
          <ExternalLink className="w-5 h-5" />
          Ver Site
        </Link>
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full justify-start gap-3 px-4 py-3 text-sm text-foreground/40 hover:text-destructive h-auto font-normal"
        >
          <LogOut className="w-5 h-5" />
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
      <aside className="hidden lg:flex w-64 min-h-screen border-r border-white/5 bg-[#0d0d0d] flex-col fixed left-0 top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="glass border-white/10"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 bg-[#0d0d0d] border-r border-white/10 p-0"
          >
            <SidebarContent onLinkClick={() => setIsMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
