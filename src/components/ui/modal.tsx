"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type * as React from "react";

const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalPortal = DialogPrimitive.Portal;
const ModalClose = DialogPrimitive.Close;

type ModalOverlayProps = React.ComponentPropsWithRef<typeof DialogPrimitive.Overlay>;

const ModalOverlay = ({ className, ...props }: ModalOverlayProps) => (
  <DialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-9999 bg-dark/40 backdrop-blur-sm",
      "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
      className,
    )}
    {...props}
  />
);
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

type ModalContentProps = React.ComponentPropsWithRef<typeof DialogPrimitive.Content> & {
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
};

const ModalContent = ({
  className,
  children,
  size = "md",
  showCloseButton = true,
  ...props
}: ModalContentProps) => (
  <ModalPortal>
    <ModalOverlay />
    <DialogPrimitive.Content
      className={cn(
        "fixed left-1/2 top-1/2 z-99999 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2",
        "max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl bg-white shadow-3 border border-gray-3 focus:outline-none",
        "data-[state=open]:animate-zoom-in data-[state=closed]:animate-zoom-out",
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

      {showCloseButton && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 text-dark-4 transition-colors hover:bg-gray-2 hover:text-dark focus:outline-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </ModalPortal>
);
ModalContent.displayName = DialogPrimitive.Content.displayName;

const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1 border-b border-gray-3 px-6 py-4", className)} {...props} />
);
ModalHeader.displayName = "ModalHeader";

const ModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-end gap-3 border-t border-gray-3 px-6 py-4", className)} {...props} />
);
ModalFooter.displayName = "ModalFooter";

type ModalTitleProps = React.ComponentPropsWithRef<typeof DialogPrimitive.Title>;

const ModalTitle = ({ className, ...props }: ModalTitleProps) => (
  <DialogPrimitive.Title className={cn("text-base font-semibold text-dark", className)} {...props} />
);
ModalTitle.displayName = DialogPrimitive.Title.displayName;

type ModalDescriptionProps = React.ComponentPropsWithRef<typeof DialogPrimitive.Description>;

const ModalDescription = ({ className, ...props }: ModalDescriptionProps) => (
  <DialogPrimitive.Description className={cn("text-sm text-dark-4", className)} {...props} />
);
ModalDescription.displayName = DialogPrimitive.Description.displayName;

const ModalBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 overflow-y-auto px-6 py-4", className)} {...props} />
);
ModalBody.displayName = "ModalBody";

export {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  ModalTrigger,
};
