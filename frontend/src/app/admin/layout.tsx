"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ToastProvider } from '@/components/shared/Toast';
import { Sidebar } from '@/components/admin/Sidebar';
import { AdminNavbar } from '@/components/admin/AdminNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid hydration mismatch by rendering a skeleton or null initially, but middleware ensures we're authed.
    return null;
  }

  if (pathname === '/admin/login') {
    return <ToastProvider>{children}</ToastProvider>;
  }

  return (
    <ToastProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminNavbar />
          <main className="flex-1 flex flex-col overflow-y-auto md:overflow-hidden p-4 md:p-8">
            <div className="mx-auto w-full max-w-7xl flex flex-col flex-1 overflow-visible md:overflow-hidden">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
