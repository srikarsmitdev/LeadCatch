"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface BudgetSliderProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export const BudgetSlider = ({ value, onChange, error }: BudgetSliderProps) => {
  const min = 1000;
  const max = 100000;
  const step = 1000;

  const presets = [5000, 10000, 25000, 50000, 100000];

  const percentage = ((value - min) / (max - min)) * 100;

  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <label className="text-sm text-[hsl(var(--muted-foreground))] font-medium">
          Project Budget
        </label>
        <motion.div
          key={value}
          initial={{ opacity: 0.8, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-2xl font-bold text-primary"
        >
          {formatCurrency(value)}
        </motion.div>
      </div>

      <div className="relative pt-6 pb-2">
        {/* Animated Tooltip */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute top-0 -mt-2 bg-primary text-primary-foreground text-xs py-1 px-2 rounded font-bold transform -translate-x-1/2 pointer-events-none"
              style={{ left: `${percentage}%` }}
            >
              {formatCurrency(value)}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative h-2 rounded-full bg-[hsl(var(--muted))]">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary rounded-full"
            style={{ width: `${percentage}%` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          {/* Custom Thumb */}
          <motion.div
            className="absolute top-1/2 -mt-2.5 -ml-2.5 w-5 h-5 bg-[hsl(var(--background))] border-2 border-primary rounded-full pointer-events-none shadow-[0_0_10px_rgba(139,92,246,0.5)] z-0"
            style={{ left: `${percentage}%` }}
            animate={{ scale: isDragging ? 1.3 : 1 }}
          />
        </div>

        <div className="flex justify-between mt-2 text-xs text-[hsl(var(--muted-foreground))]">
          <span>{formatCurrency(min)}</span>
          <span>{formatCurrency(max)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
              value === preset
                ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                : "bg-[hsl(var(--muted))]/50 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]",
            )}
          >
            {preset >= 1000 ? `$${preset / 1000}K` : `$${preset}`}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center space-x-2 text-red-400 text-sm overflow-hidden"
          >
            <AlertCircle className="w-4 h-4 mt-2" />
            <span className="mt-2">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
