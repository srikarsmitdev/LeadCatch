"use client";
import { useState, forwardRef, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnimatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  maxLength?: number;
}

export const AnimatedTextarea = forwardRef<
  HTMLTextAreaElement,
  AnimatedTextareaProps
>(
  (
    {
      label,
      error,
      className,
      disabled,
      maxLength = 1000,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const displayError = isFocused ? undefined : error;
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    const setRefs = (node: HTMLTextAreaElement) => {
      internalRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
          node;
      }
    };

    useEffect(() => {
      if (internalRef.current) {
        setCharCount(internalRef.current.value.length);
        internalRef.current.style.height = "auto";
        internalRef.current.style.height = `${internalRef.current.scrollHeight}px`;
      }
    }, [value, defaultValue]);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (internalRef.current) {
        internalRef.current.style.height = "auto";
        internalRef.current.style.height = `${internalRef.current.scrollHeight}px`;
      }
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    const percentFilled = charCount / maxLength;
    let counterColor = "text-[hsl(var(--muted-foreground))]";
    if (percentFilled > 0.9) counterColor = "text-red-400";
    else if (percentFilled > 0.75) counterColor = "text-yellow-400";
    else if (percentFilled > 0.5) counterColor = "text-emerald-400";

    return (
      <div className={cn("relative w-full", className)}>
        <div className="relative">
          <textarea
            ref={setRefs}
            disabled={disabled}
            placeholder=" "
            maxLength={maxLength}
            rows={1}
            className={cn(
              "peer w-full resize-none bg-muted/20 rounded-t-md px-4 py-4 pt-8 text-base outline-none transition-colors overflow-hidden",
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
            onChange={handleInput}
            value={value}
            defaultValue={defaultValue}
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
          <div className="absolute right-4 top-4 flex items-center space-x-2">
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
            </AnimatePresence>
          </div>
        </div>

        {/* Footer: Error Message and Char Counter */}
        <div className="flex justify-between items-start mt-1 h-5 overflow-hidden">
          <AnimatePresence>
            {displayError ? (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs text-red-400"
              >
                {displayError}
              </motion.p>
            ) : (
              <div />
            )}
          </AnimatePresence>
          <motion.span
            className={cn(
              "text-xs transition-colors duration-300",
              counterColor,
            )}
            layout
          >
            {charCount} / {maxLength}
          </motion.span>
        </div>
      </div>
    );
  },
);
AnimatedTextarea.displayName = "AnimatedTextarea";
