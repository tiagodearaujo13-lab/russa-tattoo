import { z } from "zod";

/**
 * Locais do corpo disponíveis para seleção no formulário de orçamento.
 */
export const bodyLocations = [
  "Antebraço",
  "Braço",
  "Costelas",
  "Ombro",
  "Perna",
  "Tornozelo",
  "Costas",
  "Pulso",
  "Mão",
  "Pé",
  "Pescoço",
  "Outro",
] as const;

/**
 * Schema Zod para validação do pedido de orçamento.
 * Aplicado no servidor antes de qualquer mutação no banco de dados.
 */
export const quoteRequestSchema = z.object({
  clientName: z
    .string()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres." })
    .max(150, { message: "Nome deve ter no máximo 150 caracteres." })
    .trim(),

  clientEmail: z
    .string()
    .email({ message: "E-mail inválido." })
    .max(255, { message: "E-mail deve ter no máximo 255 caracteres." })
    .toLowerCase()
    .trim(),

  clientWhatsapp: z
    .string()
    .min(8, { message: "Número de telemóvel/WhatsApp inválido." })
    .max(30, { message: "Número de telemóvel/WhatsApp muito longo." })
    .regex(
      /^(\+?[1-9]\d{1,14}|\d{9,15})$/,
      {
        message:
          "Formato inválido. Use o formato internacional (ex: +351912345678).",
      }
    ),

  bodyLocation: z
    .string()
    .min(2, { message: "Local do corpo é obrigatório." })
    .max(100, { message: "Local do corpo deve ter no máximo 100 caracteres." })
    .trim(),

  description: z
    .string()
    .min(10, { message: "Descreva a sua ideia com pelo menos 10 caracteres." })
    .max(2000, { message: "Descrição deve ter no máximo 2000 caracteres." })
    .trim(),
});

export type QuoteRequestFormData = z.infer<typeof quoteRequestSchema>;
