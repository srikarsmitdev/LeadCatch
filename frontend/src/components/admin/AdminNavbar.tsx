"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Menu, Bell, Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { NotificationCenter } from './NotificationCenter';

export function AdminNavbar() {
  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 -ml-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
            <Menu className="w-5 h-5" />
          </button>
          
          <Link href="/admin" className="lg:hidden flex items-center gap-2 outline-none">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                LF
              </div>
              <span className="font-semibold text-primary">
                LeadFlow
              </span>
            </div>
          </Link>
          
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <NotificationCenter />
          
          <ThemeToggle />
          
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 flex items-center justify-center border border-border lg:hidden cursor-pointer">
            <span className="text-xs font-medium text-violet-700 dark:text-violet-300">A</span>
          </div>
        </div>
      </div>
    </header>
  );
}
