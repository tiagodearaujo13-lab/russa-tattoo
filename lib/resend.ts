import { Resend } from "resend";

/**
 * Cliente Resend para envio de e-mails transacionais.
 * Em produção, configurar domínio verificado (DNS DKIM/SPF).
 * Em sandbox: usa onboarding@resend.dev como remetente.
 */
export const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Endereço de e-mail remetente.
 * Lido da variável de ambiente EMAIL_FROM.
 */
export const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";
