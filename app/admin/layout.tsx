import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 glass border-b border-white/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="lg:hidden" /> {/* Spacer for mobile menu */}
            <div className="flex items-center gap-3 ml-auto">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground/80">
                  {session.user.email}
                </p>
                <p className="text-xs text-foreground/40">Administradora</p>
              </div>
              <div className="w-8 h-8 rounded-sm bg-white/20 flex items-center justify-center">
                <span className="text-white text-sm font-display">R</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
