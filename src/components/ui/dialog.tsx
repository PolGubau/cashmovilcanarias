"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type * as React from "react";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

type DialogOverlayProps = React.ComponentPropsWithRef<typeof DialogPrimitive.Overlay>;

const DialogOverlay = ({ className, ...props }: DialogOverlayProps) => (
  <DialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-9999 bg-dark/40 backdrop-blur-sm",
      "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
      className,
    )}
    {...props}
  />
);
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

type DialogContentProps = React.ComponentPropsWithRef<typeof DialogPrimitive.Content> & {
  size?: "sm" | "md" | "lg" | "xl";
};

const DialogContent = ({ className, children, size = "md", ...props }: DialogContentProps) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      className={cn(
        "fixed left-1/2 top-1/2 z-99999 -translate-x-1/2 -translate-y-1/2",
        "flex w-full flex-col rounded-xl bg-white shadow-3 border border-gray-3",
        "data-[state=open]:animate-zoom-in data-[state=closed]:animate-zoom-out",
        "focus:outline-none",
        {
          "max-w-sm": size === "sm",
          "max-w-lg": size === "md",
          "max-w-2xl": size === "lg",
          "max-w-4xl": size === "xl",
        },
        className,
      )}
      {...props}
    >
      {children}
      <DialogClose className="absolute right-4 top-4 rounded-md p-1 text-dark-4 hover:text-dark hover:bg-gray-2 transition-colors focus:outline-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Cerrar</span>
      </DialogClose>
    </DialogPrimitive.Content>
  </DialogPortal>
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1 border-b border-gray-3 px-6 py-4", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-end gap-3 border-t border-gray-3 px-6 py-4", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

type DialogTitleProps = React.ComponentPropsWithRef<typeof DialogPrimitive.Title>;

const DialogTitle = ({ className, ...props }: DialogTitleProps) => (
  <DialogPrimitive.Title className={cn("text-base font-semibold text-dark", className)} {...props} />
);
DialogTitle.displayName = DialogPrimitive.Title.displayName;

type DialogDescriptionProps = React.ComponentPropsWithRef<typeof DialogPrimitive.Description>;

const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => (
  <DialogPrimitive.Description className={cn("text-sm text-dark-4", className)} {...props} />
);
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 overflow-y-auto px-6 py-4", className)} {...props} />
);
DialogBody.displayName = "DialogBody";

export {
  Dialog, DialogBody, DialogClose, DialogContent,
  DialogDescription, DialogFooter, DialogHeader,
  DialogOverlay, DialogPortal, DialogTitle, DialogTrigger,
};
