"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function CustomModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: CustomModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      
      <div
        className={cn(
          "relative z-50 flex w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl flex-col gap-4 border bg-background pt-5 sm:pt-6 shadow-xl rounded-lg sm:rounded-xl animate-in fade-in-0 zoom-in-95 duration-200",
          "max-h-[calc(100vh-2rem)]",
          className
        )}
        role="dialog"
      >
        <div className="flex flex-col space-y-1.5 text-center sm:text-left px-5 sm:px-6 pr-12 flex-shrink-0">
          {title && <h2 className="text-xl font-semibold leading-none tracking-tight">{title}</h2>}
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:bg-accent hover:text-accent-foreground p-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none cursor-pointer"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Scroll container now handles its own horizontal padding so the scrollbar sits flush against the right edge */}
        <div className={cn("flex-1 overflow-y-auto px-5 sm:px-6", !footer && "pb-5 sm:pb-6")}>
          {children}
        </div>

        {footer && (
          <div className="flex-shrink-0 border-t bg-background px-5 sm:px-6 py-4 rounded-b-lg sm:rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
