import type { Metadata } from "next";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import LanguageProvider from "@/components/public/LanguageProvider";
import CustomCursor from "@/components/public/CustomCursor";

export const metadata: Metadata = {
  title: "Russa Tattoo Studio — Atelier Exclusivo de Tatuagem | Parchal, Algarve",
  description:
    "Atelier exclusivo de tatuagem em Parchal, Algarve, Portugal. Mais de 12 anos de experiência com especialidade em Fine Line, Botânica, Micro-Realismo e Lettering delicado. Solicite o seu orçamento.",
  keywords: [
    "tatuagem",
    "tattoo",
    "algarve",
    "parchal",
    "fine line",
    "botânica",
    "micro realismo",
    "lettering",
    "minimalista",
    "estúdio tatuagem algarve",
    "russa tattoo",
    "arte autoral",
  ],
  openGraph: {
    title: "Russa Tattoo Studio — Parchal, Algarve",
    description: "Atelier exclusivo de tatuagem em Parchal, Algarve. Fine Line, Botânica, Micro-Realismo e arte autoral.",
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
    <LanguageProvider>
      <CustomCursor />
      <Header />
      <main>{children}</main>
      <Footer />
    </LanguageProvider>
  );
}
