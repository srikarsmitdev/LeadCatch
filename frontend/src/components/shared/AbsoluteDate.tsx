"use client";

import React, { useState, useEffect } from 'react';

/**
 * Renders an absolute date respecting the user's browser locale and timezone.
 * Avoids React hydration errors by rendering on the client only.
 */
export function AbsoluteDate({ 
  dateString, 
  includeTime = false 
}: { 
  dateString: string; 
  includeTime?: boolean 
}) {
  const [formatted, setFormatted] = useState<string>('');

  useEffect(() => {
    const formatTime = () => {
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return "Invalid date";
        }

        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          ...(includeTime && {
            hour: 'numeric',
            minute: '2-digit',
          })
        };

        const dtf = new Intl.DateTimeFormat(undefined, options);
        return dtf.format(date);
      } catch (e) {
        return "Unknown date";
      }
    };

    setFormatted(formatTime());
  }, [dateString, includeTime]);

  if (!formatted) return <span className="opacity-0">Loading...</span>;

  return <span>{formatted}</span>;
}
