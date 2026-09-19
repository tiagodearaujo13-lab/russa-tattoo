import type { Metadata } from "next";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

export const metadata: Metadata = {
  title: "Russa Tattoo Studio — Arte que Marca para Sempre | Algarve",
  description:
    "Estúdio de tatuagem e piercing no Algarve, Portugal. Especialista em Fine Line, Blackwork e estilos minimalistas. Agende a sua sessão online.",
  keywords: [
    "tatuagem",
    "tattoo",
    "piercing",
    "algarve",
    "faro",
    "fine line",
    "blackwork",
    "minimalista",
    "estúdio tatuagem portugal",
  ],
  openGraph: {
    title: "Russa Tattoo Studio",
    description: "Arte que marca para sempre. Tatuagens exclusivas no Algarve.",
    type: "website",
    locale: "pt_PT",
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
