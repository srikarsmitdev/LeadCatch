"use client";
import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isValid?: boolean;
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  (
    {
      label,
      error,
      isValid,
      className,
      type = "text",
      disabled,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const displayError = isFocused ? undefined : error;

    return (
      <div className={cn("relative w-full", className)}>
        <div className="relative">
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            placeholder=" "
            className={cn(
              "peer w-full bg-muted/20 rounded-t-md px-4 py-4 pt-8 text-base outline-none transition-colors",
              "border-b-2 border-[hsl(var(--border))] hover:border-[hsl(var(--muted-foreground))]/40",
              "focus:border-transparent",
              disabled && "opacity-50 cursor-not-allowed",
              displayError && "border-red-500/50 hover:border-red-500/70",
            )}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />

          {/* Floating Label */}
          <label
            className={cn(
              "pointer-events-none absolute left-4 top-5 origin-left text-[hsl(var(--muted-foreground))] transition-all duration-300 ease-out",
              "peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-primary",
              "peer-not-placeholder-shown:-translate-y-3 peer-not-placeholder-shown:scale-75",
              displayError ? "peer-focus:text-red-400 text-red-400/70" : "",
            )}
          >
            {label}
          </label>

          {/* Animated Underline */}
          <motion.div
            className={cn(
              "absolute bottom-0 left-0 h-[2px] w-full origin-center",
              displayError ? "bg-red-500" : "bg-primary",
            )}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isFocused ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />

          {/* Icons */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <AnimatePresence>
              {displayError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </motion.div>
              )}
              {isValid && !displayError && type === "email" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Error Message */}
        <div className="h-5 mt-1 overflow-hidden">
          <AnimatePresence>
            {displayError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs text-red-400"
              >
                {displayError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  },
);
AnimatedInput.displayName = "AnimatedInput";
