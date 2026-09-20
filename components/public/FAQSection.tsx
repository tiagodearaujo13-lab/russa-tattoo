"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "./LanguageProvider";

export default function FAQSection() {
  const { tObject, t } = useLanguage();
  const faqs = tObject<{ question: string; answer: string }[]>("faq.items");

  return (
    <section id="faq" className="relative bg-[#0c0c0c] py-24 text-white md:py-32">
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="font-edo text-xs uppercase tracking-[0.25em] text-zinc-400">
            {t("faq.eyebrow")}
          </span>
          <h2 className="font-edo mt-4 text-3xl sm:text-4xl md:text-5xl uppercase tracking-[0.06em] text-white">
            {t("faq.title")}
          </h2>
          <div className="mx-auto mt-4 h-[2px] w-12 bg-white" />
          <p className="mt-5 font-times text-base sm:text-lg text-zinc-300">
            {t("faq.support")}
          </p>
        </motion.div>

        {/* Acordeão com Perguntas em Edo SZ e Respostas em Times New Roman */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Accordion>
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border-t border-white/[0.08] last:border-b"
              >
                <AccordionTrigger className="group/accordion-trigger min-h-12 gap-4 rounded-none py-5 text-left hover:no-underline [&>svg]:hidden">
                  <span className="font-edo text-base sm:text-lg tracking-[0.04em] text-white group-hover/accordion-trigger:text-zinc-300 transition-colors">
                    {faq.question}
                  </span>
                  <span className="relative ml-auto h-5 w-5 shrink-0 text-xl font-light leading-none text-zinc-400">
                    <span className="absolute inset-0 transition-opacity group-aria-expanded/accordion-trigger:opacity-0">
                      +
                    </span>
                    <span className="absolute inset-0 opacity-0 transition-opacity group-aria-expanded/accordion-trigger:opacity-100">
                      −
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pr-6 sm:pr-10 font-times text-base sm:text-lg leading-relaxed text-zinc-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
