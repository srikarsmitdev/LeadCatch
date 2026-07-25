"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, Users, BarChart3, Settings, Moon, Sun, 
  LogOut, User, Loader2, ChevronUp 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import { removeAuthCookie } from '@/app/actions/auth';
import { useToast } from '@/components/shared/Toast';
import { api } from '@/lib/api';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await api.auth.logout();
      await removeAuthCookie();
      localStorage.clear();
      sessionStorage.clear();
      queryClient.clear();
      addToast("Logged out successfully.", "success");
      // Use window.location to ensure a hard reload clearing all React states
      window.location.href = '/';
    } catch (error) {
      addToast("Logout failed. Please try again.", "error");
      setIsLoggingOut(false);
      setLogoutDialogOpen(false);
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r bg-background/80 backdrop-blur-xl z-40">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/admin" className="flex items-center gap-2 outline-none">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            LF
          </div>
          <span className="font-semibold text-lg text-primary">
            LeadFlow
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <motion.nav 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-1"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.div key={item.name} variants={itemVariants}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50",
                    isActive 
                      ? "bg-violet-500/10 text-violet-700 dark:text-violet-300 relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-violet-600 before:rounded-r-full" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-violet-600 dark:text-violet-400" : "")} />
                  {item.name}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>
      </div>

      <div className="p-4 border-t mt-auto">
        <div className="flex items-center justify-between gap-3 px-1 py-1">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-full bg-muted flex items-center justify-center overflow-hidden border shadow-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-sm font-semibold text-foreground truncate">Admin User</span>
              <span className="text-xs text-muted-foreground truncate">admin@leadflow.com</span>
            </div>
          </div>
          
          <button 
            onClick={() => setLogoutDialogOpen(true)}
            title="Logout"
            className="shrink-0 p-2 rounded-lg border bg-background hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 text-muted-foreground transition-all outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog.Root open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AnimatePresence>
          {logoutDialogOpen && (
            <AlertDialog.Portal forceMount>
              <div className="fixed inset-0 z-[10000] flex items-center justify-center">
                <AlertDialog.Overlay asChild>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                  />
                </AlertDialog.Overlay>
                <AlertDialog.Content asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="z-[10001] w-full max-w-md p-6 bg-popover rounded-2xl border shadow-xl relative overflow-hidden"
                  >
                    {isLoggingOut && (
                      <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                      </div>
                    )}
                    <AlertDialog.Title className="text-xl font-bold mb-2">
                      Logout?
                    </AlertDialog.Title>
                    <AlertDialog.Description className="text-muted-foreground mb-6">
                      You're about to end your current admin session. You will need to log in again to access the dashboard.
                    </AlertDialog.Description>
                    <div className="flex items-center justify-end gap-3">
                      <AlertDialog.Cancel asChild>
                        <button 
                          disabled={isLoggingOut}
                          className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted text-muted-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                        >
                          Cancel
                        </button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action asChild>
                        <button 
                          onClick={(e) => { e.preventDefault(); handleLogout(); }}
                          disabled={isLoggingOut}
                          className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 flex items-center gap-2"
                        >
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </button>
                      </AlertDialog.Action>
                    </div>
                  </motion.div>
                </AlertDialog.Content>
              </div>
            </AlertDialog.Portal>
          )}
        </AnimatePresence>
      </AlertDialog.Root>
    </aside>
  );
}
