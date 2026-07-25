"use client";

import React, { useState, useMemo } from "react";
import * as Popover from "@radix-ui/react-popover";
import * as Tabs from "@radix-ui/react-tabs";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { motion, AnimatePresence } from "framer-motion";
import { isToday, isYesterday } from "date-fns";
import { RelativeTime } from "@/components/shared/RelativeTime";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Bell, Check, CheckCircle2, Trash2, Link, Search, X, 
  UserPlus, RefreshCw, Trash, Info, Copy
} from "lucide-react";
import { api } from "@/lib/api";
import { Notification } from "@/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/shared/Toast";
import { useRouter } from "next/navigation";

// Utility for grouping
const groupNotifications = (notifications: Notification[]) => {
  const groups: Record<string, Notification[]> = {
    Today: [],
    Yesterday: [],
    Older: [],
  };

  notifications.forEach(n => {
    const date = new Date(n.createdAt);
    if (isToday(date)) groups.Today.push(n);
    else if (isYesterday(date)) groups.Yesterday.push(n);
    else groups.Older.push(n);
  });

  return groups;
};

const getIconForType = (type: string) => {
  switch (type) {
    case 'lead_created': return <UserPlus className="w-4 h-4 text-blue-500" />;
    case 'status_changed': return <RefreshCw className="w-4 h-4 text-amber-500" />;
    case 'lead_deleted': return <Trash className="w-4 h-4 text-red-500" />;
    default: return <Info className="w-4 h-4 text-violet-500" />;
  }
};

export function NotificationCenter() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data: notificationsResponse, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.notifications.getAll(),
    refetchInterval: 10000, // Poll every 10s for real-time feel
  });

  const notifications = notificationsResponse?.data || [];
  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  const filteredNotifications = useMemo(() => {
    return notifications
      .filter(n => (activeTab === "unread" ? !n.read : true))
      .filter(n => 
        searchQuery === "" || 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        n.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [notifications, activeTab, searchQuery]);

  const grouped = groupNotifications(filteredNotifications);

  const markReadMutation = useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) => api.notifications.markAsRead(id, read),
    onMutate: async ({ id, read }) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueryData<{ data: Notification[] }>(["notifications"]);
      if (previous) {
        queryClient.setQueryData(["notifications"], {
          ...previous,
          data: previous.data.map(n => n.id === id ? { ...n, read } : n)
        });
      }
      return { previous };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.notifications.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.notifications.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const handleNotificationClick = (n: Notification) => {
    if (!n.read) markReadMutation.mutate({ id: n.id, read: true });
    
    setOpen(false); // Close popover

    if (n.leadId) {
      // Navigate to the dashboard with the leadId query param so it opens automatically
      router.push(`/admin?viewLeadId=${n.leadId}`);
    } else {
      addToast("Related lead is no longer available.", "info");
    }
  };

  const handleCopyLink = (n: Notification) => {
    if (n.leadId) {
      const url = `${window.location.origin}/admin?viewLeadId=${n.leadId}`;
      navigator.clipboard.writeText(url);
      addToast("Link copied to clipboard", "success");
    }
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="relative p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
          <Bell className="w-5 h-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-background"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </Popover.Trigger>

      <AnimatePresence>
        {open && (
          <Popover.Portal forceMount>
            <>
              {/* Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[9998] bg-foreground/5 backdrop-blur-[3px] dark:bg-background/40"
              />
              <Popover.Content 
                sideOffset={12} 
                align="end"
                className="z-[9999] w-[380px] sm:w-[420px] max-w-[100vw] focus:outline-none"
                asChild
              >
                <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="premium-glass rounded-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[600px] shadow-[0_12px_48px_-12px_rgba(0,0,0,0.2)]"
              >
                {/* Header */}
                <div className="p-4 border-b flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      Notifications
                      {unreadCount > 0 && (
                        <span className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 text-xs px-2 py-0.5 rounded-full font-medium">
                          {unreadCount} new
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => markAllReadMutation.mutate()}
                        disabled={unreadCount === 0 || markAllReadMutation.isPending}
                        className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline disabled:opacity-50"
                      >
                        Mark all as read
                      </button>
                      <Popover.Close asChild>
                        <button className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </Popover.Close>
                    </div>
                  </div>

                  {/* Search and Tabs */}
                  <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex items-center justify-between gap-4">
                      <Tabs.List className="flex gap-2 p-1 bg-muted/50 rounded-lg">
                        <Tabs.Trigger value="all" className="px-3 py-1 text-xs font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all">
                          All
                        </Tabs.Trigger>
                        <Tabs.Trigger value="unread" className="px-3 py-1 text-xs font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all">
                          Unread
                        </Tabs.Trigger>
                      </Tabs.List>
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <input 
                          type="text" 
                          placeholder="Search..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 bg-background/40 hover:bg-background/60 focus:bg-background/80 border border-border/50 focus:border-violet-500 rounded-lg text-xs transition-all outline-none shadow-inner"
                        />
                      </div>
                    </div>
                  </Tabs.Root>
                </div>

                {/* List */}
                <div 
                  className="flex-1 overflow-y-auto overscroll-contain"
                  style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
                >
                  {isLoading ? (
                    <div className="p-4 space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-3 animate-pulse">
                          <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-muted rounded w-1/3" />
                            <div className="h-3 bg-muted rounded w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                      <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-3">
                        <Bell className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                      <p className="font-medium text-foreground">You're all caught up</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {searchQuery ? "No notifications match your search." : "No new notifications right now."}
                      </p>
                    </div>
                  ) : (
                    <div className="py-2">
                      {Object.entries(grouped).map(([groupName, items]) => {
                        if (items.length === 0) return null;
                        return (
                          <div key={groupName} className="mb-4 last:mb-0">
                            <div className="px-4 py-2 bg-background/30 text-[10px] font-bold text-muted-foreground uppercase tracking-widest sticky top-0 z-10 backdrop-blur-md border-y border-border/20">
                              {groupName}
                            </div>
                            <div className="divide-y divide-border/20">
                              {items.map((notification) => (
                                <div key={notification.id}>
                                    <div 
                                      onClick={() => handleNotificationClick(notification)}
                                      className={cn(
                                        "group relative flex items-start gap-4 p-4 cursor-pointer transition-all duration-200",
                                        "hover:bg-foreground/5 hover:-translate-y-0.5 hover:shadow-sm",
                                        !notification.read ? "bg-violet-500/5 dark:bg-violet-500/10 border-l-2 border-l-violet-500" : "bg-transparent border-l-2 border-l-transparent"
                                      )}
                                    >
                                      {/* Icon */}
                                      <div className={cn(
                                        "w-9 h-9 shrink-0 rounded-full flex items-center justify-center border",
                                        !notification.read ? "bg-background border-violet-100 dark:border-violet-800 shadow-sm" : "bg-muted/50 border-transparent"
                                      )}>
                                        {getIconForType(notification.type)}
                                      </div>

                                      {/* Content */}
                                      <div className="flex flex-col flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                          <p className={cn("text-sm font-semibold truncate", !notification.read ? "text-foreground" : "text-foreground/80")}>
                                            {notification.title}
                                          </p>
                                          {/* Unread Dot */}
                                          {!notification.read && (
                                            <div className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                                          )}
                                        </div>
                                        <p className={cn("text-xs line-clamp-2", !notification.read ? "text-muted-foreground" : "text-muted-foreground/70")}>
                                          {notification.description}
                                        </p>

                                        {/* Bottom Row: Timestamp & Actions */}
                                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/10">
                                          <span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap">
                                            <RelativeTime dateString={notification.createdAt} />
                                          </span>

                                          {/* Quick Hover Actions */}
                                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            {notification.leadId && (
                                              <button 
                                                onClick={(e) => { e.stopPropagation(); handleCopyLink(notification); }}
                                                className="p-1.5 hover:bg-background/80 rounded-sm text-muted-foreground hover:text-foreground border border-transparent hover:border-border/50 transition-all hover:shadow-sm"
                                                title="Copy Lead Link"
                                              >
                                                <Copy className="w-3.5 h-3.5" />
                                              </button>
                                            )}
                                            <button 
                                              onClick={(e) => { e.stopPropagation(); markReadMutation.mutate({ id: notification.id, read: !notification.read }); }}
                                              className="p-1.5 hover:bg-background/80 rounded-sm text-muted-foreground hover:text-foreground border border-transparent hover:border-border/50 transition-all hover:shadow-sm"
                                              title={notification.read ? "Mark as unread" : "Mark as read"}
                                            >
                                              {notification.read ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                                            </button>
                                            <button 
                                              onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(notification.id); }}
                                              className="p-1.5 hover:bg-red-500/10 rounded-sm text-muted-foreground hover:text-red-500 border border-transparent hover:border-red-500/20 transition-all hover:shadow-sm"
                                              title="Delete"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t bg-muted/20 text-center">
                  <button 
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View Notification Settings
                  </button>
                </div>
              </motion.div>
            </Popover.Content>
            </>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  );
}
