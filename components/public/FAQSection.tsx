"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Qual é o valor de uma tatuagem?",
    answer:
      "O valor varia conforme o tamanho, complexidade e tempo de trabalho. Tatuagens pequenas e minimalistas começam a partir de 60€. Para orçamentos personalizados, envie a sua ideia através do formulário de agendamento ou pelo WhatsApp.",
  },
  {
    question: "Quanto tempo demora uma sessão?",
    answer:
      "Sessões pequenas duram entre 30 minutos e 2 horas. Peças maiores podem exigir sessões de 3 a 5 horas. O tempo é discutido previamente para garantir conforto e qualidade.",
  },
  {
    question: "Dói muito tatuar?",
    answer:
      "A sensação varia conforme a zona do corpo e a tolerância individual. Áreas com menos tecido adiposo (costelas, pés, mãos) tendem a ser mais sensíveis. A maioria dos clientes descreve a sensação como um 'arranhar' suportável.",
  },
  {
    question: "Quais são os cuidados após a tatuagem?",
    answer:
      "Manter o filme protetor por 3-4 horas, lavar com sabão neutro e água morna, aplicar pomada cicatrizante (ex: Bepanthen) 3x ao dia durante 15 dias, evitar sol direto e piscinas por 30 dias, e não coçar ou descascar a pele.",
  },
  {
    question: "Posso levar o meu próprio desenho?",
    answer:
      "Sim! Encorajamos que traga referências e ideias. A Russa irá adaptar o design à anatomia e ao seu estilo preferido, garantindo um resultado exclusivo e harmonioso.",
  },
  {
    question: "Fazem retoque?",
    answer:
      "Sim, oferecemos retoque gratuito dentro de 30 dias após a sessão, caso seja necessário. Após esse período, o retoque é cobrado como uma sessão normal.",
  },
  {
    question: "É necessário fazer alguma preparação antes da sessão?",
    answer:
      "Sim: dormir bem na noite anterior, alimentar-se antes da sessão, evitar bebidas alcoólicas 24h antes, manter a pele hidratada e sem bronzeamento recente, e vestir roupa confortável que facilite o acesso à zona a tatuar.",
  },
  {
    question: "Aceitam menores de idade?",
    answer:
      "Tatuagens são realizadas apenas em maiores de 18 anos com identificação válida. Piercings em menores de 16 anos requerem autorização escrita e presença do responsável legal.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-white text-sm font-semibold tracking-widest uppercase">
            Dúvidas
          </span>
          <h2 className="font-display text-4xl md:text-5xl mt-3 mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-foreground/60">
            Tudo o que precisa saber antes da sua sessão.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Accordion className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="glass rounded-sm border-white/10 px-6 data-[state=open]:border-white/15 transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-medium text-foreground/90 hover:text-white transition-colors py-5 hover:no-underline gap-3">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/60 leading-relaxed pb-5 pl-8">
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
