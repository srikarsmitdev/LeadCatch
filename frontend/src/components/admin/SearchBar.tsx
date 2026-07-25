"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { useKeyboardShortcut, useDebounce } from '@/hooks';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search leads...", className }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the local value and sync to parent
  const debouncedValue = useDebounce(localValue, 300);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useKeyboardShortcut("k", () => {
    inputRef.current?.focus();
  }, { ctrl: true });

  const handleClear = () => {
    setLocalValue("");
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative group w-full max-w-sm", className)}>
      <motion.div
        animate={{ scale: isFocused ? 1.05 : 1 }}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] z-10"
      >
        <Search className={cn(
          "w-4 h-4 transition-colors",
          isFocused ? "text-violet-500" : "text-[hsl(var(--muted-foreground))]"
        )} />
      </motion.div>
      
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn(
          "w-full h-10 pl-10 pr-12 rounded-lg border bg-[hsl(var(--background))]/50 backdrop-blur-sm text-sm outline-none transition-all",
          "placeholder:text-[hsl(var(--muted-foreground))]",
          "focus-visible:ring-2 focus-visible:ring-violet-500/20 focus-visible:border-violet-500",
          "hover:bg-[hsl(var(--background))] hover:border-[hsl(var(--border))]/80"
        )}
        aria-label="Search leads"
      />
      
      <AnimatePresence>
        {localValue ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] p-1 rounded-sm hover:bg-[hsl(var(--muted))] cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </motion.button>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 h-5 rounded border bg-[hsl(var(--muted))]/50 text-[10px] font-medium text-[hsl(var(--muted-foreground))]">
              <span>Ctrl</span>K
            </kbd>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
