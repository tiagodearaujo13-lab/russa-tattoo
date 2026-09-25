import type { Metadata } from "next";
import { Bodoni_Moda, Cormorant_Garamond, Montserrat } from "next/font/google";
import { STUDIO_CONFIG } from "@/lib/constants/studio";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-russa",
  weight: ["400", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-tatuadora",
  weight: ["200", "300", "400", "500", "600", "700"],
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
    default: "Russa Tattoo Studio — Atelier Exclusivo de Tatuagem · Fine Line & Arte Autoral",
    template: "%s | Russa Tattoo Studio",
  },
  description:
    "Russa Tattoo Studio em Parchal, Algarve, Portugal. Atelier exclusivo de tatuagem especializado em Fine Line, Botânica, Micro-Realismo e arte autoral. Solicite o seu orçamento.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  alternates: { languages: { "pt-PT": "/", en: "/" } },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    alternateLocale: ["en_GB"],
    title: "Russa Tattoo Studio — Parchal, Algarve",
    description: "Atelier exclusivo de tatuagem em Parchal, Algarve. Fine Line, Botânica, Micro-Realismo e arte autoral.",
    siteName: "Russa Tattoo Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Russa Tattoo Studio — Parchal, Algarve",
    description: "Atelier exclusivo de tatuagem em Parchal, Algarve, Portugal.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  name: STUDIO_CONFIG.name,
  image: "https://russatattoo.com/og-image.jpg",
  "@id": "https://russatattoo.com/#studio",
  url: "https://russatattoo.com",
  telephone: STUDIO_CONFIG.contact.phone,
  email: STUDIO_CONFIG.email,
  sameAs: [STUDIO_CONFIG.instagram.url],
  priceRange: "$$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: STUDIO_CONFIG.location.street,
    addressLocality: STUDIO_CONFIG.location.parish,
    postalCode: STUDIO_CONFIG.location.postalCode,
    addressRegion: STUDIO_CONFIG.location.region,
    addressCountry: STUDIO_CONFIG.location.countryCode,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: STUDIO_CONFIG.location.coordinates.latitude,
    longitude: STUDIO_CONFIG.location.coordinates.longitude,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "19:00",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className="h-full antialiased scroll-smooth">
      <body className={`${bodoniModa.variable} ${montserrat.variable} ${cormorant.variable} min-h-full flex flex-col bg-[#1A1A1A] text-white`}>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
