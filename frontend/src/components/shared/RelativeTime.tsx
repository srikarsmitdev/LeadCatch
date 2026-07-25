"use client";

import React, { useState, useEffect } from 'react';

/**
 * A production-ready, auto-updating relative time component.
 * It strictly relies on the browser's native Intl API for robust
 * localization and timezones without huge dependencies like moment.js.
 */
export function RelativeTime({ dateString }: { dateString: string }) {
  const [formatted, setFormatted] = useState<string>('');

  useEffect(() => {
    // We only execute on the client to avoid hydration mismatch
    const formatTime = () => {
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return "Invalid date";
        }
        
        const now = new Date();
        const diffMs = date.getTime() - now.getTime();
        const diffSecs = Math.round(diffMs / 1000);
        const diffMins = Math.round(diffSecs / 60);
        const diffHours = Math.round(diffMins / 60);
        const diffDays = Math.round(diffHours / 24);

        const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto', style: 'short' });
        
        // Less than a minute
        if (Math.abs(diffSecs) < 60) {
          if (Math.abs(diffSecs) < 30) return "Just now";
          return rtf.format(diffSecs, 'second');
        }
        // Less than an hour
        if (Math.abs(diffMins) < 60) {
          return rtf.format(diffMins, 'minute');
        }
        // Less than 24 hours
        if (Math.abs(diffHours) < 24) {
          return rtf.format(diffHours, 'hour');
        }
        // Less than 7 days
        if (Math.abs(diffDays) < 7) {
          return rtf.format(diffDays, 'day');
        }
        
        // Older than 7 days: display formatted absolute date (e.g. Jul 24, 2026 or 24 Jul 2026 depending on locale)
        const dtf = new Intl.DateTimeFormat(undefined, { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
        return dtf.format(date);
      } catch (e) {
        return "Unknown date";
      }
    };

    setFormatted(formatTime());

    // Update every minute to keep relative time accurate
    const interval = setInterval(() => {
      setFormatted(formatTime());
    }, 60000);

    return () => clearInterval(interval);
  }, [dateString]);

  // Before hydration, render nothing to avoid React mismatch warnings, 
  // or render a blank space to hold the layout
  if (!formatted) return <span className="opacity-0">Loading...</span>;

  return <span>{formatted}</span>;
}
