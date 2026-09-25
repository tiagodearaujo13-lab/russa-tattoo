export const STUDIO_CONFIG = {
  name: "Russa Tattoo Studio",
  artist: "Russa",
  email: "russatatuadora@gmail.com",
  instagram: {
    handle: "@russatatuadora",
    url: "https://www.instagram.com/russatatuadora/",
  },
  contact: {
    phone: "+351 900 000 000",
    phoneDisplay: "+351 900 000 000",
    whatsappUrl: "https://wa.me/351900000000",
    instagramUrl: "https://www.instagram.com/russatatuadora/",
  },
  location: {
    street: "Urbanização das Palmeiras, Lote 4, R/C Loja D",
    postalCode: "8400-623",
    parish: "Parchal",
    municipality: "Lagoa",
    region: "Algarve",
    country: "Portugal",
    countryCode: "PT",
    coordinates: {
      latitude: 37.1352,
      longitude: -8.5225,
    },
    formattedAddress:
      "Urbanização das Palmeiras, Lote 4 R/C Loja D, 8400-623 Parchal, Portugal",
  },
  maps: {
    directSearchUrl:
      "https://www.google.com/maps/search/?api=1&query=Urbaniza%C3%A7%C3%A3o+das+Palmeiras+Lote+4+R%2FC+Loja+D+8400-623+Parchal",
    embedUrl:
      "https://maps.google.com/maps?q=Urbaniza%C3%A7%C3%A3o+das+Palmeiras+Lote+4+R%2FC+Loja+D+Parchal+8400-623&t=&z=16&ie=UTF8&iwloc=&output=embed",
  },
  get address() {
    return {
      street: this.location.street,
      postalCode: this.location.postalCode,
      city: this.location.parish,
      region: this.location.region,
      country: this.location.country,
      full: this.location.formattedAddress,
      googleMapsUrl: this.maps.directSearchUrl,
      embedMapUrl: this.maps.embedUrl,
    };
  },
} as const;

// Deixar configurável; fallback para o contato oficial
export const STUDIO_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
  STUDIO_CONFIG.contact.phone.replace(/[^0-9]/g, "");

export function getWhatsAppUrl(message?: string) {
  const number = STUDIO_WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
  if (!number) return STUDIO_CONFIG.contact.whatsappUrl;
  const defaultMessage =
    "Olá Russa! Gostaria de solicitar um orçamento para uma tatuagem autoral.";
  return `https://wa.me/${number}?text=${encodeURIComponent(message ?? defaultMessage)}`;
}
