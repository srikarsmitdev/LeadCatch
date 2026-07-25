"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimatedCounter } from './AnimatedCounter';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ElementType;
  color?: "blue" | "green" | "violet" | "amber" | "rose";
  delay?: number;
}

export function StatsCard({ 
  title, 
  value, 
  prefix, 
  suffix, 
  trend, 
  icon: Icon, 
  color = "violet",
  delay = 0 
}: StatsCardProps) {
  const colorStyles = {
    blue: "bg-blue-500/10 text-blue-500",
    green: "bg-emerald-500/10 text-emerald-500",
    violet: "bg-violet-500/10 text-violet-500",
    amber: "bg-amber-500/10 text-amber-500",
    rose: "bg-rose-500/10 text-rose-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -2 }}
      className="group flex flex-col p-6 rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md hover:border-violet-500/30"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className={cn("p-2 rounded-full", colorStyles[color])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="flex flex-col gap-1">
        <h3 className="text-2xl font-semibold tracking-tight text-foreground">
          <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
        </h3>
        
        {trend && (
          <div className="flex items-center gap-1 text-sm mt-1">
            {trend.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
            )}
            <span className={cn(
              "font-medium",
              trend.isPositive ? "text-emerald-500" : "text-rose-500"
            )}>
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground text-xs ml-1">vs last month</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
