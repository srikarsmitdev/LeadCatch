"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type LeadStatus = "new" | "contacted" | "closed";

interface StatusBadgeProps {
  status: LeadStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  const config = {
    new: {
      label: "New",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      dot: "bg-blue-500"
    },
    contacted: {
      label: "Contacted",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      dot: "bg-amber-500"
    },
    closed: {
      label: "Closed",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      dot: "bg-emerald-500"
    }
  };

  const current = config[status] || config.new;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2"
  };

  const dotClasses = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2"
  };

  return (
    <motion.span
      layoutId={`badge-${status}`}
      className={cn(
        "inline-flex items-center font-medium rounded-full border transition-colors",
        sizeClasses[size],
        current.color,
        className
      )}
    >
      <span className={cn("rounded-full animate-pulse", dotClasses[size], current.dot)} />
      {current.label}
    </motion.span>
  );
}
