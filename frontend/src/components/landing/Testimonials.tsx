"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/animations";

const testimonials = [
  {
    quote: "LeadFlow completely transformed our sales pipeline. We're capturing 40% more qualified leads and closing them twice as fast thanks to the automated scoring.",
    author: "Sarah Jenkins",
    role: "VP of Sales, TechCorp",
    avatar: "https://i.pravatar.cc/150?img=47"
  },
  {
    quote: "The form builder is incredibly intuitive, and the real-time analytics give us exactly the insights we need. Best lead capture platform on the market.",
    author: "David Chen",
    role: "Growth Marketer, StartupX",
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  {
    quote: "We integrated LeadFlow with our CRM in minutes. The seamless data sync and team collaboration features have made our sales team unstoppable.",
    author: "Elena Rodriguez",
    role: "CEO, Innovate Solutions",
    avatar: "https://i.pravatar.cc/150?img=5"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.h2 
            variants={staggerItem}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            Loved by revenue teams
          </motion.h2>
          <motion.p 
            variants={staggerItem}
            className="text-lg text-muted-foreground"
          >
            Don't just take our word for it. Here's what our customers have to say about LeadFlow.
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-border shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex text-yellow-400 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-lg leading-relaxed text-foreground mb-8">
                  &quot;{testimonial.quote}&quot;
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full border border-border object-cover"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.author}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
