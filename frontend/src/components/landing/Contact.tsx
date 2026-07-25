"use client";

import { motion } from "framer-motion";
import { fadeInUp, defaultViewport } from "@/lib/animations";
import { LeadForm } from "@/components/lead-form/LeadForm";

export default function Contact() {
  return (
    <section id="contact" className="w-full relative px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeInUp}
          className="max-w-3xl mx-auto text-center mb-8"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Ready to <span className="text-primary">grow your business</span>?
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeInUp}
          className="max-w-xl mx-auto"
        >
          <LeadForm />
        </motion.div>
      </div>
    </section>
  );
}
