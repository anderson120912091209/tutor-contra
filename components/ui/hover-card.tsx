"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface HoverCardProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

export function HoverCard({ trigger, content, className }: HoverCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {trigger}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-80 p-4 bg-white border rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2",
            className
          )}
        >
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b" />
          {content}
        </div>
      )}
    </div>
  );
}

