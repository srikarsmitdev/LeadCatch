"use client";

import { motion } from "framer-motion";
import { 
  FormInput, 
  BarChart3, 
  Target, 
  Users, 
  Zap, 
  Blocks 
} from "lucide-react";
import { staggerContainer, staggerItem, hoverLift, defaultViewport } from "@/lib/animations";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Smart Forms",
    description: "Build beautiful, high-converting forms with our drag-and-drop builder. Conditional logic included.",
    icon: FormInput,
  },
  {
    title: "Real-time Analytics",
    description: "Track conversions, drop-offs, and source attribution in real-time with beautiful dashboards.",
    icon: BarChart3,
  },
  {
    title: "Lead Scoring",
    description: "Automatically score leads based on behavior, demographics, and engagement using AI.",
    icon: Target,
  },
  {
    title: "Team Collaboration",
    description: "Assign leads, leave internal notes, and collaborate with your team to close deals faster.",
    icon: Users,
  },
  {
    title: "Automation",
    description: "Trigger emails, webhooks, and assign tasks automatically when new leads are captured.",
    icon: Zap,
  },
  {
    title: "Integrations",
    description: "Connect with Salesforce, HubSpot, Slack, and 100+ other tools in just one click.",
    icon: Blocks,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 relative bg-secondary/30 dark:bg-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">scale</span>
          </motion.h2>
          <motion.p 
            variants={staggerItem}
            className="text-lg text-muted-foreground"
          >
            Powerful features designed to help you capture more leads and close more deals, without the complexity.
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              whileHover={hoverLift.whileHover}
              className="p-8 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-violet-500/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-6 text-violet-600 dark:text-violet-400">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
