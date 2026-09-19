import { z } from "zod";

/**
 * Categorias de estilo para a galeria.
 */
export const galleryCategories = [
  "Fine Line",
  "Blackwork",
  "Old School",
  "Neo Traditional",
  "Realismo",
  "Aquarela",
  "Tribal",
  "Minimalista",
  "Geométrico",
  "Lettering",
  "Pontilhismo",
  "Piercing",
  "Outro",
] as const;

/**
 * Schema Zod para validação de itens da galeria.
 * Aplicado no servidor antes de inserção/atualização no banco.
 */
export const galleryItemSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Título deve ter pelo menos 2 caracteres." })
    .max(150, { message: "Título deve ter no máximo 150 caracteres." })
    .trim(),

  styleCategory: z.enum(galleryCategories, {
    message: "Selecione uma categoria válida.",
  }),

  imageUrl: z
    .string()
    .url({ message: "URL da imagem inválida." }),

  instagramPostUrl: z
    .string()
    .url({ message: "URL do post do Instagram inválida." })
    .regex(
      /^https?:\/\/(www\.)?instagram\.com\/.+/,
      { message: "A URL deve ser um link válido do Instagram." }
    ),

  featured: z
    .boolean()
    .default(false),
});

export type GalleryItemFormData = z.infer<typeof galleryItemSchema>;

/**
 * Schema para atualização parcial de itens da galeria.
 */
export const galleryItemUpdateSchema = galleryItemSchema.partial();
export type GalleryItemUpdateData = z.infer<typeof galleryItemUpdateSchema>;
