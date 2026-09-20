import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Russa Tattoo Studio — Arte que Marca para Sempre",
    template: "%s | Russa Tattoo Studio",
  },
  description:
    "Russa Tattoo Studio no Algarve, Portugal. Tattoo & body piercing com Fine Line, Blackwork e estilos minimalistas. Agende a sua sessão.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  alternates: { languages: { "pt-PT": "/", en: "/" } },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    alternateLocale: ["en_GB"],
    title: "Russa Tattoo Studio — Algarve",
    description: "Arte que marca para sempre. Tattoo & body piercing no Algarve, Portugal.",
    siteName: "Russa Tattoo Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Russa Tattoo Studio — Algarve",
    description: "Tattoo & body piercing no Algarve, Portugal.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  name: "Russa Tattoo Studio",
  description: "Tattoo & body piercing studio no Algarve, Portugal.",
  url: process.env.NEXTAUTH_URL || "http://localhost:3000",
  telephone: "+351 912 345 678",
  priceRange: "Desde 25€",
  areaServed: "Algarve, Portugal",
  address: { "@type": "PostalAddress", addressRegion: "Algarve", addressCountry: "PT" },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "15:00" },
  ],
  hasOfferCatalog: { "@type": "OfferCatalog", name: "Tattoo & Body Piercing", itemListElement: [{ "@type": "Offer", name: "Piercing", price: "25", priceCurrency: "EUR" }] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className="h-full antialiased scroll-smooth">
      <body className={`${montserrat.variable} ${cormorant.variable} min-h-full flex flex-col bg-[#0c0c0c] text-white`}>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
