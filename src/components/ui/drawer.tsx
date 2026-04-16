"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
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

const SIZES = { sm: "max-w-xs", md: "max-w-md", lg: "max-w-xl" };

export function Drawer({ open, onClose, title, description, side = "right", size = "md", children, footer }: DrawerProps) {
  // Lock scroll when open
  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-99999 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-dark/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative flex flex-col h-full w-full bg-white shadow-3 border-gray-3",
          SIZES[size],
          side === "right" ? "ml-auto border-l animate-slide-in-from-right" : "mr-auto border-r",
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-gray-3 px-6 py-4 shrink-0">
            <div>
              {title && <h2 className="text-base font-semibold text-dark">{title}</h2>}
              {description && <p className="mt-0.5 text-sm text-dark-4">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="ml-4 rounded-md p-1 text-dark-4 hover:text-dark hover:bg-gray-2 transition-colors focus:outline-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-3 px-6 py-4 shrink-0">{footer}</div>
        )}
      </aside>
    </div>
  );
}

/** Hook for managing drawer state */
export function useDrawer() {
  const [open, setOpen] = React.useState(false);
  return { open, onOpen: () => setOpen(true), onClose: () => setOpen(false) };
}
