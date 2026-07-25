"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { UserPlus, RefreshCw, Mail, Activity as ActivityIcon, Trash } from 'lucide-react';
import { RelativeTime } from '@/components/shared/RelativeTime';
import { Notification } from '@/types';

interface RecentActivityProps {
  activities: Notification[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lead_created': return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'status_changed': return <RefreshCw className="w-4 h-4 text-amber-500" />;
      case 'lead_deleted': return <Trash className="w-4 h-4 text-red-500" />;
      default: return <ActivityIcon className="w-4 h-4 text-violet-500" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <ActivityIcon className="w-8 h-8 text-muted/30 mb-3" />
        <p className="text-sm text-muted-foreground">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shrink-0 p-6 pb-4 border-b">
        <h3 className="text-sm font-medium flex items-center gap-2 m-0">
          <ActivityIcon className="w-4 h-4 text-muted-foreground" />
          Recent Activity
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 pt-4 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border"
        >
          {activities.map((activity) => (
            <motion.div 
              key={activity.id}
              variants={itemVariants}
              className="relative flex items-center gap-4 py-2"
            >
              <div className="relative z-10 w-8 h-8 rounded-full bg-background border flex items-center justify-center shrink-0 shadow-sm">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex flex-col flex-1 min-w-0">
                <p className="text-sm text-foreground truncate font-medium">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {activity.description}
                </p>
                <span className="text-[10px] text-muted-foreground/70 mt-0.5">
                  <RelativeTime dateString={activity.createdAt} />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
