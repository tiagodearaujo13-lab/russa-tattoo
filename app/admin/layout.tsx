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
    <div className="flex min-h-screen bg-[#141414]">
      <AdminSidebar />
      <main className="min-w-0 flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 border-b border-[#CCCCCC]/10 bg-[#141414]/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="lg:hidden" /> {/* Spacer for mobile menu */}
            <div className="flex items-center gap-3 ml-auto">
              <div className="text-right">
                <p className="font-tatuadora text-[10px] font-medium uppercase tracking-[0.14em] text-[#DCDCDC]">
                  {session.user.email}
                </p>
                <p className="mt-1 font-tatuadora text-[8px] uppercase tracking-[0.25em] text-[#808080]">Administradora</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center border border-white/20 bg-[#222222]">
                <span className="font-russa text-sm text-white">R</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-5 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
