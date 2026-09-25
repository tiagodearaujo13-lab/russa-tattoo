"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle, MessageCircle } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { requestQuoteAction } from "@/server/actions/quotes.actions";
import { STUDIO_WHATSAPP_NUMBER } from "@/lib/constants/studio";
import { bodyLocations } from "@/lib/validations/quote.schema";

type FormState = {
  clientName: string;
  clientEmail: string;
  clientWhatsapp: string;
  bodyLocation: string;
  description: string;
};

const initialForm: FormState = {
  clientName: "",
  clientEmail: "",
  clientWhatsapp: "",
  bodyLocation: "",
  description: "",
};

export default function QuoteRequestSection() {
  const { language } = useLanguage();
  const [form, setForm] = useState<FormState>(initialForm);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await requestQuoteAction({
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        clientWhatsapp: form.clientWhatsapp.replace(/\s/g, ""),
        bodyLocation: form.bodyLocation,
        description: form.description,
      });

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message);
      }
    });
  };

  const whatsappNumber = STUDIO_WHATSAPP_NUMBER;
  const hasWhatsApp = whatsappNumber.length > 0;

  const whatsappUrl = hasWhatsApp
    ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `Olá Russa! Acabei de enviar um pedido de orçamento pelo site para uma tatuagem.\n\nNome: ${form.clientName}\nLocal: ${form.bodyLocation}\nIdeia: ${form.description}`
      )}`
    : "";

  const inputBaseClass =
    "w-full border border-[#CCCCCC]/15 bg-[#1A1A1A] px-4 py-3 font-tatuadora text-sm text-white placeholder:text-[#666666] outline-none transition-all duration-300 focus:border-[#CCCCCC]/40 focus:ring-1 focus:ring-[#CCCCCC]/20";

  const labelClass =
    "block mb-2 font-tatuadora text-[9px] uppercase tracking-[0.25em] text-[#9E9E9E] font-medium";

  return (
    <section
      id="orcamento"
      className="relative bg-[#1A1A1A] py-24 text-white md:py-32"
    >
      <div className="container mx-auto max-w-4xl px-5 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="font-tatuadora text-[9.5px] uppercase tracking-[0.3em] text-[#DCDCDC] font-medium">
            {language === "pt" ? "Orçamento Exclusivo" : "Exclusive Quote"}
          </span>
          <h2 className="font-russa mt-4 text-3xl sm:text-4xl md:text-5xl uppercase tracking-[-0.01em] text-white font-bold">
            {language === "pt"
              ? "Solicite o Seu Orçamento"
              : "Request Your Quote"}
          </h2>
          <div className="mx-auto mt-4 h-[1.5px] w-12 bg-white/30" />
          <p className="mt-5 mx-auto max-w-2xl font-tatuadora text-base sm:text-lg text-[#DCDCDC] font-light">
            {language === "pt"
              ? "Descreva a sua ideia, o local do corpo e as dimensões pretendidas. A Russa analisará cada detalhe e entrará em contacto direto para alinhar o projeto e agendar a sua sessão exclusiva."
              : "Describe your idea, body placement and desired dimensions. Russa will review every detail and contact you directly to align the project and schedule your exclusive session."}
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="border border-[#CCCCCC]/15 bg-[#222222] p-6 sm:p-10"
        >
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center border border-emerald-500/30 bg-emerald-500/10">
                  <CheckCircle className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="font-russa text-2xl sm:text-3xl font-bold text-white mb-4">
                  {language === "pt"
                    ? "Orçamento Enviado"
                    : "Quote Submitted"}
                </h3>
                <p className="max-w-md font-tatuadora text-base text-[#DCDCDC] font-light leading-relaxed">
                  {language === "pt"
                    ? "Solicitação de orçamento enviada com sucesso. A Russa analisará os detalhes do seu projeto e entrará em contacto direto para alinhar os detalhes e agendar a sua sessão no atelier."
                    : "Quote request submitted successfully. Russa will review your project details and contact you directly to align details and schedule your session at the atelier."}
                </p>

                {hasWhatsApp && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex min-h-11 items-center gap-2 border border-[#CCCCCC]/20 bg-[#1A1A1A] px-6 py-3 font-tatuadora text-[10px] uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {language === "pt"
                      ? "Agilizar pelo WhatsApp"
                      : "Speed up via WhatsApp"}
                  </a>
                )}
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Nome */}
                <div>
                  <label htmlFor="quote-name" className={labelClass}>
                    {language === "pt" ? "Nome Completo" : "Full Name"} *
                  </label>
                  <input
                    id="quote-name"
                    name="clientName"
                    type="text"
                    required
                    minLength={2}
                    maxLength={150}
                    value={form.clientName}
                    onChange={handleChange}
                    placeholder={
                      language === "pt"
                        ? "Seu nome completo"
                        : "Your full name"
                    }
                    className={inputBaseClass}
                  />
                </div>

                {/* E-mail e WhatsApp */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="quote-email" className={labelClass}>
                      {language === "pt"
                        ? "E-mail de Contacto"
                        : "Contact Email"}{" "}
                      *
                    </label>
                    <input
                      id="quote-email"
                      name="clientEmail"
                      type="email"
                      required
                      maxLength={255}
                      value={form.clientEmail}
                      onChange={handleChange}
                      placeholder="seuemail@exemplo.com"
                      className={inputBaseClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="quote-whatsapp" className={labelClass}>
                      {language === "pt"
                        ? "Telemóvel / WhatsApp"
                        : "Phone / WhatsApp"}{" "}
                      *
                    </label>
                    <input
                      id="quote-whatsapp"
                      name="clientWhatsapp"
                      type="tel"
                      required
                      minLength={8}
                      maxLength={30}
                      value={form.clientWhatsapp}
                      onChange={handleChange}
                      placeholder="+351 9... ou com código do país"
                      className={inputBaseClass}
                    />
                  </div>
                </div>

                {/* Local do Corpo */}
                <div>
                  <label htmlFor="quote-body" className={labelClass}>
                    {language === "pt"
                      ? "Local do Corpo / Colocação"
                      : "Body Placement"}{" "}
                    *
                  </label>
                  <select
                    id="quote-body"
                    name="bodyLocation"
                    required
                    value={form.bodyLocation}
                    onChange={handleChange}
                    className={`${inputBaseClass} ${!form.bodyLocation ? "text-[#666666]" : ""}`}
                  >
                    <option value="" disabled>
                      {language === "pt"
                        ? "Selecione o local do corpo"
                        : "Select body placement"}
                    </option>
                    {bodyLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Descrição da Ideia */}
                <div>
                  <label htmlFor="quote-description" className={labelClass}>
                    {language === "pt"
                      ? "Tamanho Estimado e Ideia da Tatuagem"
                      : "Estimated Size & Tattoo Idea"}{" "}
                    *
                  </label>
                  <textarea
                    id="quote-description"
                    name="description"
                    required
                    minLength={10}
                    maxLength={2000}
                    rows={5}
                    value={form.description}
                    onChange={handleChange}
                    placeholder={
                      language === "pt"
                        ? "Descreva a sua ideia, dimensões em cm aproximadas, referências e se prefere Fine Line, Botânica ou Micro-realismo..."
                        : "Describe your idea, approximate dimensions in cm, references and whether you prefer Fine Line, Botanical or Micro-realism..."
                    }
                    className={`${inputBaseClass} resize-none`}
                  />
                </div>

                {/* Erro */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-tatuadora text-sm text-red-400"
                  >
                    {error}
                  </motion.p>
                )}

                {/* RGPD */}
                <p className="font-tatuadora text-[10px] text-[#808080] leading-relaxed">
                  {language === "pt"
                    ? "Ao submeter, autorizo o contacto via e-mail e WhatsApp para alinhamento do orçamento, em conformidade com o RGPD."
                    : "By submitting, I authorise contact via email and WhatsApp for quote alignment, in accordance with GDPR."}
                </p>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="btn-dotwork-primary min-h-[48px] w-full px-8 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      {language === "pt" ? "A enviar..." : "Sending..."}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      {language === "pt"
                        ? "Solicitar Orçamento"
                        : "Request Quote"}
                    </span>
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
