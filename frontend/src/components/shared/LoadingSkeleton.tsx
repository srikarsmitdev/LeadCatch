"use client";

import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "text" | "circle" | "card" | "table-row";
  count?: number;
}

export function LoadingSkeleton({ className, variant = "text", count = 1 }: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === "card") {
    return (
      <>
        {items.map((i) => (
          <div key={i} className={cn("rounded-xl border border-border/50 p-6 space-y-4", className)}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg shimmer" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-24 rounded shimmer" />
                <div className="h-5 w-16 rounded shimmer" />
              </div>
            </div>
            <div className="h-2 w-full rounded shimmer" />
          </div>
        ))}
      </>
    );
  }

  if (variant === "table-row") {
    return (
      <>
        {items.map((i) => (
          <div key={i} className={cn("flex items-center gap-4 p-4", className)}>
            <div className="h-4 w-32 rounded shimmer" />
            <div className="h-4 w-48 rounded shimmer" />
            <div className="h-6 w-20 rounded-full shimmer" />
            <div className="h-4 w-24 rounded shimmer ml-auto" />
          </div>
        ))}
      </>
    );
  }

  if (variant === "circle") {
    return (
      <>
        {items.map((i) => (
          <div key={i} className={cn("h-12 w-12 rounded-full shimmer", className)} />
        ))}
      </>
    );
  }

  return (
    <>
      {items.map((i) => (
        <div key={i} className={cn("h-4 rounded shimmer", className)} />
      ))}
    </>
  );
}
