import type { Metadata } from "next";
import { Montserrat, Permanent_Marker } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  variable: "--font-permanent-marker",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Russa Tattoo Studio — Arte que Marca para Sempre",
    template: "%s | Russa Tattoo Studio",
  },
  description:
    "Estúdio de tatuagem e piercing no Algarve, Portugal. Especialista em Fine Line, Blackwork e estilos minimalistas. Agende a sua sessão online.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className="dark h-full antialiased">
      <body className={`${montserrat.variable} ${permanentMarker.variable} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
