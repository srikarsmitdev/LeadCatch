"use client";

import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { StatusBadge, LeadStatus } from './StatusBadge';
import { Check, ChevronDown } from 'lucide-react';

interface StatusDropdownProps {
  status: LeadStatus;
  onStatusChange: (status: LeadStatus) => void;
  disabled?: boolean;
}

export const StatusDropdown = React.memo(function StatusDropdown({ status, onStatusChange, disabled = false }: StatusDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const statuses: { value: LeadStatus; label: string; dotClass: string }[] = [
    { value: "new", label: "New", dotClass: "bg-blue-500" },
    { value: "contacted", label: "Contacted", dotClass: "bg-amber-500" },
    { value: "closed", label: "Closed", dotClass: "bg-emerald-500" },
  ];

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex items-center gap-1 transition-opacity outline-none",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-80 rounded-sm"
          )}
        >
          <StatusBadge status={status} size="sm" />
          <ChevronDown className="w-3 h-3 text-muted-foreground ml-0.5" />
        </button>
      </DropdownMenu.Trigger>
      
      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content 
              asChild
              sideOffset={5} 
              align="start"
              className="z-[9999]"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="min-w-[140px] rounded-md border bg-popover p-1 shadow-md outline-none"
              >
                {statuses.map((s) => (
                  <DropdownMenu.Item
                    key={s.value}
                    onSelect={(e) => {
                      e.preventDefault(); // Prevent default close so we can animate out
                      if (status !== s.value) onStatusChange(s.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground",
                      status === s.value ? "bg-accent/50" : ""
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full mr-2", s.dotClass)} />
                    <span className="flex-1 text-left">{s.label}</span>
                    {status === s.value && (
                      <Check className="w-3 h-3 text-foreground ml-auto" />
                    )}
                  </DropdownMenu.Item>
                ))}
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
});
