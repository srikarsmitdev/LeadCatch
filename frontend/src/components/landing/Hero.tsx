"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Star } from "lucide-react";
import Link from "next/link";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { useMousePosition } from "@/hooks";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Mouse parallax calculation
  const mouseX = mousePosition.x ? (mousePosition.x / (typeof window !== 'undefined' ? window.innerWidth : 1000) - 0.5) * 50 : 0;
  const mouseY = mousePosition.y ? (mousePosition.y / (typeof window !== 'undefined' ? window.innerHeight : 1000) - 0.5) * 50 : 0;

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden noise-overlay"
    >
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{ x: mouseX * -1, y: mouseY * -1 }}
          transition={{ type: "spring", damping: 50, stiffness: 100 }}
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-violet-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"
        />
        <motion.div
          animate={{ x: mouseX, y: mouseY }}
          transition={{ type: "spring", damping: 50, stiffness: 100 }}
          className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"
        />
      </div>

      <motion.div 
        style={{ y, opacity }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-8"
        >
          <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-4 ring-1 ring-violet-200 dark:ring-violet-800">
            <span className="flex h-2 w-2 rounded-full bg-violet-600 dark:bg-violet-400 animate-pulse"></span>
            Introducing LeadFlow 2.0
          </motion.div>

          <motion.h1 
            variants={staggerItem}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground"
          >
            Capture <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Leads,</span>
            <br />
            Close Deals <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Faster</span>
          </motion.h1>

          <motion.p 
            variants={staggerItem}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            The premium lead capture platform designed for modern teams. Build high-converting forms, score leads automatically, and integrate seamlessly with your CRM.
          </motion.p>

          <motion.div 
            variants={staggerItem}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95 rounded-lg shadow-lg shadow-primary/20 group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 rounded-lg group"
            >
              <Play className="mr-2 h-5 w-5 fill-current" />
              Watch Demo
            </Link>
          </motion.div>

          <motion.div 
            variants={staggerItem}
            className="pt-12 flex flex-col items-center gap-4"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden`} style={{ zIndex: 10 - i }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt={`User ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span>2,000+ teams trust LeadFlow</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
