import { Resend } from "resend";

/**
 * Cliente Resend para envio de e-mails transacionais.
 * Em produção, configurar domínio verificado (DNS DKIM/SPF).
 * Em sandbox: usa onboarding@resend.dev como remetente.
 */
// O SDK exige uma chave na construção. A chave de build nunca é válida para envio;
// a aplicação deve receber RESEND_API_KEY no runtime para enviar e-mails.
export const resend = new Resend(
  process.env.RESEND_API_KEY?.trim() || "re_build_placeholder"
);

/**
 * Endereço de e-mail remetente.
 * Lido da variável de ambiente EMAIL_FROM.
 */
export const emailFrom =
  process.env.EMAIL_FROM?.trim() || "onboarding@resend.dev";
