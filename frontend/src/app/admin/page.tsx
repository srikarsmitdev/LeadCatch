"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { LeadStatus } from '@/types';
import { StatsCard } from '@/components/admin/StatsCard';
import { LeadTable } from '@/components/admin/LeadTable';
import { SearchBar } from '@/components/admin/SearchBar';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { useToast } from '@/components/shared/Toast';
import { Users, UserPlus, PhoneCall, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fadeInUp } from '@/lib/animations';

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: statsResponse, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.dashboard.getStats(),
  });

  const { data: leadsResponse, isLoading: isLoadingLeads } = useQuery({
    queryKey: ['leads'],
    queryFn: () => api.leads.getAll(),
  });

  const { data: notificationsResponse, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.notifications.getAll(),
  });

  const stats = statsResponse?.data;
  const leads = leadsResponse?.data ?? [];
  const activities = notificationsResponse?.data?.slice(0, 10) ?? [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      api.leads.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      addToast('Status updated successfully', 'success');
    },
    onError: () => {
      addToast('Failed to update status', 'error');
    },
  });

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status: status as LeadStatus });
  };

  const tabs = [
    { id: 'all', label: 'All Leads' },
    { id: 'new', label: 'New' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'closed', label: 'Closed' },
  ];

  return (
    <div className="flex flex-col h-auto md:h-full overflow-visible md:overflow-hidden space-y-6 pb-2">


      {/* Stats Grid */}
      {isLoadingStats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
          <LoadingSkeleton variant="card" count={4} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
          <StatsCard
            title="Total Leads"
            value={stats?.totalLeads || 0}
            icon={Users}
            color="violet"
            trend={{ value: 12, isPositive: true }}
            delay={0.1}
          />
          <StatsCard
            title="New Leads"
            value={stats?.newLeads || 0}
            icon={UserPlus}
            color="blue"
            trend={{ value: 5, isPositive: true }}
            delay={0.2}
          />
          <StatsCard
            title="Contacted"
            value={stats?.contactedLeads || 0}
            icon={PhoneCall}
            color="amber"
            delay={0.3}
          />
          <StatsCard
            title="Conversion Rate"
            value={stats?.conversionRate || 0}
            suffix="%"
            icon={Percent}
            color="green"
            trend={{ value: 2, isPositive: false }}
            delay={0.4}
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0 overflow-visible md:overflow-hidden">
        {/* Leads Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="xl:col-span-2 flex flex-col space-y-4 overflow-visible md:overflow-hidden md:h-full"
        >
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shrink-0">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-full sm:max-w-xs"
            />

            <div className="flex items-center p-1 rounded-lg bg-[hsl(var(--muted))]/50 border overflow-x-auto w-full sm:w-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={cn(
                    'relative px-4 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap outline-none cursor-pointer',
                    statusFilter === tab.id
                      ? 'text-[hsl(var(--foreground))]'
                      : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--background))]/50'
                  )}
                >
                  {statusFilter === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[hsl(var(--background))] rounded-md shadow-sm border"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Lead Table */}
          <div className="rounded-xl border bg-[hsl(var(--card))]/50 backdrop-blur-sm flex flex-col flex-1 min-h-0 overflow-visible md:overflow-hidden">
            {isLoadingLeads ? (
              <div className="p-6">
                <LoadingSkeleton variant="table-row" count={6} />
              </div>
            ) : (
              <LeadTable
                leads={leads}
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
        </motion.div>

        {/* Recent Activity Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="xl:col-span-1 flex flex-col overflow-visible md:overflow-hidden md:h-full"
        >
          <div className="bg-[hsl(var(--card))]/50 backdrop-blur-sm border rounded-xl flex flex-col shadow-sm md:h-full overflow-hidden">
            {isLoadingActivities ? (
              <div className="space-y-4">
                <LoadingSkeleton className="h-5 w-32" />
                <LoadingSkeleton variant="table-row" count={4} />
              </div>
            ) : (
              <RecentActivity activities={activities} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
