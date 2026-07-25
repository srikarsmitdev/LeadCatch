"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { fadeInUp, defaultViewport } from "@/lib/animations";

const faqs = [
  {
    question: "How does the pricing work?",
    answer: "We offer flexible, tier-based pricing based on the number of leads you capture per month. All plans include core features, with advanced features like custom integrations and AI scoring available on higher tiers."
  },
  {
    question: "What CRMs do you integrate with?",
    answer: "LeadFlow integrates natively with Salesforce, HubSpot, Pipedrive, and Zoho CRM. We also offer Zapier integration, allowing you to connect with over 3,000 other applications."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! We offer a 14-day free trial on all plans. No credit card is required to sign up. You can test all features and see the value before committing."
  },
  {
    question: "How secure is the data captured?",
    answer: "Security is our top priority. All data is encrypted at rest and in transit. We are SOC2 compliant and GDPR ready. We never sell or share your lead data with third parties."
  },
  {
    question: "What kind of support do you offer?",
    answer: "All customers get access to our comprehensive knowledge base and email support. Pro and Enterprise plans include priority 24/7 chat support and a dedicated customer success manager."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 sm:py-32 bg-secondary/30 dark:bg-secondary/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Got questions? We've got answers. If you don't see what you're looking for, feel free to reach out.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeInUp}
          className="space-y-4"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="border border-border rounded-xl bg-card overflow-hidden transition-colors hover:border-violet-500/30"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-xl"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 ml-4"
                  >
                    <Plus className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
