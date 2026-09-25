/**
 * Helper de normalização editorial para taxonomia dinâmica de estilos de tatuagem.
 * Converte entradas arbitrárias em formato editorial ("Fine Line Floral") e slugs canônicos ("fine-line-floral").
 */
export function normalizeCategory(input: string): { name: string; slug: string } {
  const cleaned = input
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

  // Converte primeira letra de cada termo para Maiúscula (Estilo Editorial de Luxo)
  const name = cleaned
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const slug = cleaned
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  return { name, slug };
}
