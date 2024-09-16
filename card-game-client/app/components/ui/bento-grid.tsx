import { cn } from "@/app/lib/utils";
import React from "react";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export default function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "w-full",
        "grid gap-2",
        "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3",
        "auto-rows-[22rem]",
        "px-4",
        "box-border",
        className
      )}
    >
      {children}
    </div>
  );
}
