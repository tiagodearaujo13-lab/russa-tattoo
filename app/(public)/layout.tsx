import type { Metadata } from "next";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import LanguageProvider from "@/components/public/LanguageProvider";
import CustomCursor from "@/components/public/CustomCursor";

export const metadata: Metadata = {
  title: "Russa Tattoo Studio — Arte que Marca para Sempre | Algarve",
  description:
    "Atelier Boutique de tatuagem e body piercing no Algarve, Portugal. Mais de 12 anos de experiência com especialidade em Fine Line, Botânica, Micro-Realismo e Lettering delicado. Agende a sua sessão.",
  keywords: [
    "tatuagem",
    "tattoo",
    "piercing",
    "algarve",
    "fine line",
    "botânica",
    "micro realismo",
    "lettering",
    "minimalista",
    "estúdio tatuagem algarve",
    "russa tattoo",
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
    <LanguageProvider>
      <CustomCursor />
      <Header />
      <main>{children}</main>
      <Footer />
    </LanguageProvider>
  );
}
