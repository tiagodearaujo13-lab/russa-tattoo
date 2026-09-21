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
    <section id="faq" className="relative bg-[#1A1A1A] py-24 text-white md:py-32 border-t border-[#CCCCCC]/20">
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
            {t("faq.eyebrow")}
          </span>
          <h2 className="font-russa mt-4 text-3xl sm:text-4xl md:text-5xl uppercase tracking-[-0.01em] text-white font-bold">
            {t("faq.title")}
          </h2>
          <div className="mx-auto mt-4 h-[1.5px] w-12 bg-white/30" />
          <p className="mt-5 font-times text-base sm:text-lg text-[#DCDCDC] font-light">
            {t("faq.support")}
          </p>
        </motion.div>

        {/* Acordeão com Perguntas em Bodoni Moda e Respostas em Times New Roman */}
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
                className="border-t border-[#CCCCCC]/20 last:border-b"
              >
                <AccordionTrigger className="group/accordion-trigger min-h-12 gap-4 rounded-none py-5 text-left hover:no-underline [&>svg]:hidden">
                  <span className="font-russa text-base sm:text-lg tracking-[0.01em] text-white font-bold group-hover/accordion-trigger:text-[#DCDCDC] transition-colors">
                    {faq.question}
                  </span>
                  <span className="relative ml-auto h-5 w-5 shrink-0 text-xl font-light leading-none text-[#CCCCCC]">
                    <span className="absolute inset-0 transition-opacity group-aria-expanded/accordion-trigger:opacity-0">
                      +
                    </span>
                    <span className="absolute inset-0 opacity-0 transition-opacity group-aria-expanded/accordion-trigger:opacity-100">
                      −
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pr-6 sm:pr-10 font-times text-base sm:text-lg leading-relaxed text-[#DCDCDC]">
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
