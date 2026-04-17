"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import * as React from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  side?: "right" | "left";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const SIZES = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-xl" };

export function Drawer({
  open,
  onClose,
  title,
  description,
  side = "right",
  size = "md",
  children,
  footer,
}: DrawerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-99999 bg-dark/50 backdrop-blur-sm",
            "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
          )}
        />

        {/* Panel */}
        <DialogPrimitive.Content
          className={cn(
            "fixed top-0 bottom-0 z-99999 flex flex-col h-full w-full bg-white shadow-3 focus:outline-none",
            SIZES[size],
            side === "right"
              ? "right-0 border-l border-gray-3 data-[state=open]:animate-slide-in-from-right data-[state=closed]:animate-slide-out-to-right"
              : "left-0 border-r border-gray-3 data-[state=open]:animate-slide-in-from-left data-[state=closed]:animate-slide-out-to-left",
          )}
        >
          {/* Header */}
          {(title || description) && (
            <div className="flex items-start justify-between border-b border-gray-3 px-6 py-5 shrink-0">
              <div>
                {title && (
                  <DialogPrimitive.Title className="text-lg font-semibold text-dark">
                    {title}
                  </DialogPrimitive.Title>
                )}
                {description && (
                  <DialogPrimitive.Description className="mt-1 text-sm text-dark-4">
                    {description}
                  </DialogPrimitive.Description>
                )}
              </div>
              <DialogPrimitive.Close
                className="ml-4 rounded-lg p-1.5 text-dark-4 hover:text-dark hover:bg-gray-2 transition-colors focus:outline-none"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Cerrar</span>
              </DialogPrimitive.Close>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 no-scrollbar">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="border-t border-gray-3 px-6 py-5 shrink-0">
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** Hook for managing drawer state */
export function useDrawer() {
  const [open, setOpen] = React.useState(false);
  return { open, onOpen: () => setOpen(true), onClose: () => setOpen(false) };
}
