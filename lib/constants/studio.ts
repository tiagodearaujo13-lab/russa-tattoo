export const STUDIO_CONFIG = {
  name: "Russa Tattoo Studio",
  instagram:
    process.env.NEXT_PUBLIC_STUDIO_INSTAGRAM ||
    "https://www.instagram.com/russatatuadora/",
  whatsappNumber: process.env.NEXT_PUBLIC_STUDIO_WHATSAPP || "+351900000000",
  whatsappMessage: "Olá Russa! Gostaria de tirar uma dúvida sobre agendamento.",
  address: {
    street: process.env.NEXT_PUBLIC_STUDIO_ADDRESS || "Algarve, Portugal",
    city: "Algarve",
    country: "Portugal",
    googleMapsUrl:
      process.env.NEXT_PUBLIC_STUDIO_MAPS_URL ||
      "https://maps.google.com/?q=Algarve+Portugal",
    embedMapUrl: process.env.NEXT_PUBLIC_STUDIO_MAP_EMBED || "",
  },
} as const;

export function getWhatsAppUrl(message = STUDIO_CONFIG.whatsappMessage) {
  const number = STUDIO_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
