import { z } from "zod";

/**
 * Schema de validação Zod para submissão/edição de obras no portfólio.
 * Aplicado estritamente no formulário e no Server Action.
 */
export const galleryItemFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "O título deve ter no mínimo 2 caracteres")
    .max(120, "O título deve conter no máximo 120 caracteres"),
  description: z
    .string()
    .trim()
    .max(500, "A descrição não pode exceder 500 caracteres")
    .optional(),
  imageUrl: z.string().url("URL de imagem inválida"),
  imageKey: z.string().min(1, "Chave do arquivo de imagem ausente"),
  category: z
    .string()
    .trim()
    .min(2, "O estilo deve possuir no mínimo 2 caracteres")
    .max(60, "O estilo não deve ultrapassar 60 caracteres")
    .refine((val) => !/^[^a-zA-Z0-9À-ÿ\s]+$/.test(val), {
      message: "O nome da categoria deve conter caracteres alfanuméricos válidos",
    }),
  featured: z.boolean().default(false),
});

export type GalleryItemFormData = z.infer<typeof galleryItemFormSchema>;

// Alias para compatibilidade
export const galleryItemSchema = galleryItemFormSchema;
