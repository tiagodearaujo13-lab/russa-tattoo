import { z } from "zod";

/**
 * Estilos de tatuagem disponíveis para seleção no formulário.
 */
export const tattooStyles = [
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
  "Outro",
] as const;

/**
 * Schema Zod para validação de dados de agendamento.
 * Aplicado no servidor antes de qualquer mutação no banco de dados.
 */
export const appointmentSchema = z.object({
  slotId: z
    .string()
    .uuid({ message: "ID do horário inválido." }),

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
    .min(8, { message: "Número de WhatsApp inválido." })
    .max(30, { message: "Número de WhatsApp muito longo." })
    .regex(
      /^\+?[1-9]\d{6,14}$/,
      {
        message:
          "Formato de WhatsApp inválido. Use o formato internacional (ex: +351912345678 ou +5511999887766).",
      }
    ),

  tattooStyle: z.enum(tattooStyles, {
    message: "Selecione um estilo de tatuagem válido.",
  }),

  bodyLocation: z
    .string()
    .min(2, { message: "Local do corpo deve ter pelo menos 2 caracteres." })
    .max(100, { message: "Local do corpo deve ter no máximo 100 caracteres." })
    .trim(),

  approxSizeCm: z
    .string()
    .min(1, { message: "Informe o tamanho aproximado." })
    .max(50, { message: "Tamanho deve ter no máximo 50 caracteres." })
    .trim(),

  description: z
    .string()
    .max(500, { message: "Descrição deve ter no máximo 500 caracteres." })
    .trim()
    .optional()
    .or(z.literal("")),

  referenceImageUrl: z
    .string()
    .url({ message: "URL de referência inválida." })
    .optional()
    .or(z.literal("")),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
