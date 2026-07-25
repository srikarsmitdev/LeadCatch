"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Lead } from '@/types';
import { tableRowVariants } from '@/lib/animations';
import { StatusDropdown } from './StatusDropdown';
import { EmptyState } from './EmptyState';
import { MoreHorizontal, Eye, Mail, Trash2 } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useToast } from '@/components/shared/Toast';
import { LeadDetailsModal } from './LeadDetailsModal';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { AbsoluteDate } from '@/components/shared/AbsoluteDate';

interface LeadTableProps {
  leads: Lead[];
  searchQuery: string;
  statusFilter: string;
  onStatusChange: (id: string, status: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};



// Memoized Actions Menu
const LeadActionsMenu = React.memo(({ onView, onContact, onDelete }: { onView: () => void, onContact: () => void, onDelete: () => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors outline-none"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenu.Trigger>
      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content asChild sideOffset={5} align="end" className="z-[9999]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-36 rounded-md border bg-popover p-1 shadow-md outline-none"
              >
                <DropdownMenu.Item onSelect={onView} className="flex w-full items-center px-2 py-1.5 text-sm rounded-sm focus:bg-accent focus:text-accent-foreground outline-none cursor-pointer">
                  <Eye className="w-4 h-4 mr-2" /> View
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={onContact} className="flex w-full items-center px-2 py-1.5 text-sm rounded-sm focus:bg-accent focus:text-accent-foreground outline-none cursor-pointer">
                  <Mail className="w-4 h-4 mr-2" /> Contact
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-border my-1 mx-1" />
                <DropdownMenu.Item onSelect={onDelete} className="flex w-full items-center px-2 py-1.5 text-sm rounded-sm text-destructive focus:bg-destructive/10 outline-none cursor-pointer">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenu.Item>
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
});
LeadActionsMenu.displayName = 'LeadActionsMenu';

// Memoized Desktop Row
const DesktopRow = React.memo(({ lead, index, onStatusChange, onView, onContact, onDelete }: { lead: Lead, index: number, onStatusChange: (id: string, status: string) => void, onView: (lead: Lead) => void, onContact: (lead: Lead) => void, onDelete: (lead: Lead) => void }) => {
  const handleStatus = useCallback((status: any) => onStatusChange(lead.id, status), [lead.id, onStatusChange]);
  
  return (
    <motion.tr
      variants={tableRowVariants}
      custom={index}
      layout
      className="group hover:bg-muted/20 transition-colors"
    >
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{lead.name}</span>
          <span className="text-muted-foreground">{lead.email}</span>
        </div>
      </td>
      <td className="px-6 py-4 font-medium">{formatCurrency(lead.budget)}</td>
      <td className="px-6 py-4">
        <StatusDropdown status={lead.status as any} onStatusChange={handleStatus} />
      </td>
      <td className="px-6 py-4 text-muted-foreground"><AbsoluteDate dateString={lead.createdAt} /></td>
      <td className="px-6 py-4 text-right">
        <LeadActionsMenu 
          onView={() => onView(lead)} 
          onContact={() => onContact(lead)} 
          onDelete={() => onDelete(lead)} 
        />
      </td>
    </motion.tr>
  );
});
DesktopRow.displayName = 'DesktopRow';

// Memoized Mobile Row
const MobileRow = React.memo(({ lead, index, onStatusChange, onView, onContact, onDelete }: { lead: Lead, index: number, onStatusChange: (id: string, status: string) => void, onView: (lead: Lead) => void, onContact: (lead: Lead) => void, onDelete: (lead: Lead) => void }) => {
  const handleStatus = useCallback((status: any) => onStatusChange(lead.id, status), [lead.id, onStatusChange]);
  
  return (
    <motion.div
      variants={tableRowVariants}
      initial="hidden" animate="visible" exit="exit"
      custom={index}
      layout
      className="bg-card border rounded-xl p-4 shadow-sm"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-foreground">{lead.name}</h4>
          <p className="text-sm text-muted-foreground">{lead.email}</p>
        </div>
        <StatusDropdown status={lead.status as any} onStatusChange={handleStatus} />
      </div>
      <div className="flex items-center justify-between mt-4 text-sm border-t pt-3">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-xs">Budget</span>
          <span className="font-medium">{formatCurrency(lead.budget)}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-muted-foreground text-xs">Date</span>
          <span><AbsoluteDate dateString={lead.createdAt} /></span>
        </div>
      </div>
      <div className="flex justify-end mt-4 pt-3 border-t">
        <LeadActionsMenu 
          onView={() => onView(lead)} 
          onContact={() => onContact(lead)} 
          onDelete={() => onDelete(lead)} 
        />
      </div>
    </motion.div>
  );
});
MobileRow.displayName = 'MobileRow';

export function LeadTable({ leads, searchQuery, statusFilter, onStatusChange }: LeadTableProps) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [deleteLead, setDeleteLead] = useState<Lead | null>(null);

  // Handle opening lead from URL parameter (e.g. from notification)
  React.useEffect(() => {
    const viewLeadId = searchParams.get('viewLeadId');
    if (viewLeadId && leads.length > 0) {
      const lead = leads.find(l => l.id.toString() === viewLeadId);
      if (lead) {
        setViewLead(lead);
        // Clean up the URL after opening
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('viewLeadId');
        router.replace(`${pathname}?${newParams.toString()}`);
      }
    }
  }, [searchParams, leads, router, pathname]);

  // Memoize filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        lead.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

  const handleStatusChange = useCallback((id: string, status: string) => {
    onStatusChange(id, status);
  }, [onStatusChange]);

  const handleContact = useCallback((lead: Lead) => {
    const subject = encodeURIComponent("Regarding Your Project Inquiry");
    const body = encodeURIComponent(`Hi ${lead.name},\n\nThank you for reaching out through our website.\n\nI'd love to discuss your project with you.\n\nLooking forward to hearing from you.\n\nBest regards,`);
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${lead.email}&su=${subject}&body=${body}`;
    const mailtoUrl = `mailto:${lead.email}?subject=${subject}&body=${body}`;
    
    // Attempt to open in a new tab (Gmail)
    const win = window.open(gmailUrl, '_blank');
    if (!win) {
      // Fallback to mailto if popup blocked or not on desktop
      window.location.href = mailtoUrl;
    }
  }, []);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.leads.delete(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['leads'] });
      const previousLeads = queryClient.getQueryData<{ data: Lead[] }>(['leads']);
      
      // Optimistically update
      if (previousLeads) {
        queryClient.setQueryData(['leads'], {
          ...previousLeads,
          data: previousLeads.data.filter(l => l.id !== deletedId)
        });
      }
      return { previousLeads };
    },
    onError: (err, deletedId, context) => {
      if (context?.previousLeads) {
        queryClient.setQueryData(['leads'], context.previousLeads);
      }
      addToast('Failed to delete lead', 'error');
    },
    onSuccess: () => {
      addToast('Lead deleted successfully', 'success');
      setDeleteLead(null);
      // Invalidate to ensure stats and everything else are fresh
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    }
  });

  const confirmDelete = useCallback(() => {
    if (deleteLead) {
      deleteMutation.mutate(deleteLead.id);
    }
  }, [deleteLead, deleteMutation]);

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      {filteredLeads.length === 0 ? (
        <div className="pt-8">
          <EmptyState 
            title="No leads found" 
            description={searchQuery ? `No leads matching "${searchQuery}"` : "There are no leads that match your current filters."} 
          />
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 overflow-y-auto flex-1 min-h-0 p-1">
            <AnimatePresence>
              {filteredLeads.map((lead, i) => (
                <MobileRow 
                  key={lead.id} 
                  lead={lead} 
                  index={i} 
                  onStatusChange={handleStatusChange}
                  onView={setViewLead}
                  onContact={handleContact}
                  onDelete={setDeleteLead}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:flex flex-col flex-1 min-h-0 w-full overflow-hidden">
            <div className="flex-1 overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b sticky top-0 z-20 backdrop-blur-md shadow-sm">
                  <tr>
                    <th className="px-6 py-4 font-medium">Lead</th>
                    <th className="px-6 py-4 font-medium">Budget</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <motion.tbody 
                  initial="hidden" animate="visible"
                  className="divide-y divide-border/50"
                >
                  <AnimatePresence>
                    {filteredLeads.map((lead, i) => (
                      <DesktopRow 
                        key={lead.id} 
                        lead={lead} 
                        index={i} 
                        onStatusChange={handleStatusChange}
                        onView={setViewLead}
                        onContact={handleContact}
                        onDelete={setDeleteLead}
                      />
                    ))}
                  </AnimatePresence>
                </motion.tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <LeadDetailsModal 
        leadId={viewLead?.id || null} 
        initialData={viewLead || undefined}
        onClose={() => setViewLead(null)}
        onContact={handleContact}
        onDelete={(l) => { setViewLead(null); setDeleteLead(l); }}
      />

      <DeleteConfirmationDialog 
        open={!!deleteLead}
        onOpenChange={(open) => !open && !deleteMutation.isPending && setDeleteLead(null)}
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
