"use client";

import React, { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, CheckCircle2, Mail, Trash2 } from 'lucide-react';
import { Lead } from '@/types';
import { StatusBadge } from './StatusBadge';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { AbsoluteDate } from '@/components/shared/AbsoluteDate';

interface LeadDetailsModalProps {
  leadId: string | null;
  initialData?: Lead;
  onClose: () => void;
  onContact: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export function LeadDetailsModal({ leadId, initialData, onClose, onContact, onDelete }: LeadDetailsModalProps) {
  const [copiedEmail, setCopiedEmail] = React.useState(false);
  const [copiedMessage, setCopiedMessage] = React.useState(false);

  // We use initialData so the modal instantly renders what it knows.
  // We can also fetch the full lead in background to make sure it's up to date.
  const { data: leadResponse, isLoading } = useQuery({
    queryKey: ['lead', leadId],
    queryFn: () => api.leads.getById(leadId!),
    enabled: !!leadId,
    initialData: initialData ? { success: true, data: initialData } : undefined,
    staleTime: 60000, // cache for 1 minute
  });

  const lead = leadResponse?.data;
  const open = !!leadId;

  const handleCopy = (text: string, type: 'email' | 'message') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };


  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-md"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                className="fixed left-[50%] top-[50%] z-[10000] flex max-h-[85vh] w-[90vw] max-w-3xl translate-x-[-50%] translate-y-[-50%] flex-col rounded-xl border bg-card shadow-2xl overflow-hidden focus:outline-none"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4 bg-muted/30">
                  <Dialog.Title className="text-xl font-semibold tracking-tight text-foreground">
                    Lead Details
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="rounded-full p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {isLoading && !lead ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-8 bg-muted rounded w-1/2"></div>
                      <div className="h-32 bg-muted rounded w-full"></div>
                    </div>
                  ) : lead ? (
                    <div className="space-y-8">
                      {/* Lead Information Grid */}
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Lead Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-muted/20 p-5 rounded-lg border">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Name</p>
                            <p className="font-medium text-foreground text-lg">{lead.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Email</p>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground">{lead.email}</p>
                              <button 
                                onClick={() => handleCopy(lead.email, 'email')}
                                className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"
                                title="Copy Email"
                              >
                                {copiedEmail ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Budget</p>
                            <p className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(lead.budget)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Status</p>
                            <div className="mt-1">
                              <StatusBadge status={lead.status} size="md" />
                            </div>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-sm text-muted-foreground mb-1">Date Submitted</p>
                            <p className="text-sm text-foreground"><AbsoluteDate dateString={lead.createdAt} includeTime /></p>
                          </div>
                        </div>
                      </div>

                      {/* Project Description */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Project Description</h3>
                          <button 
                            onClick={() => handleCopy(lead.message, 'message')}
                            className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {copiedMessage ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                            {copiedMessage ? 'Copied' : 'Copy Text'}
                          </button>
                        </div>
                        <div className="bg-muted/10 p-5 rounded-lg border">
                          <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                            {lead.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10">
                      <p className="text-muted-foreground">Lead not found or error loading data.</p>
                      <button onClick={onClose} className="mt-4 text-sm text-violet-500 hover:underline">Close</button>
                    </div>
                  )}
                </div>

                {/* Footer Quick Actions */}
                {lead && (
                  <div className="border-t bg-muted/30 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button 
                      onClick={() => onDelete(lead)}
                      className="text-destructive hover:bg-destructive/10 px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Lead
                    </button>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button 
                        onClick={onClose}
                        className="px-4 py-2 rounded-md font-medium text-sm border bg-background hover:bg-accent transition-colors flex-1 sm:flex-none"
                      >
                        Close
                      </button>
                      <button 
                        onClick={() => onContact(lead)}
                        className="px-4 py-2 rounded-md font-medium text-sm bg-violet-600 text-white hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none"
                      >
                        <Mail className="w-4 h-4" /> Reply via Gmail
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
