import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:   "bg-gray-2 text-dark-3 border border-gray-3",
        primary:   "bg-blue-light-5 text-blue-dark border border-blue-light-4",
        success:   "bg-green-light-6 text-green-dark border border-green-light-4",
        warning:   "bg-yellow-light-4 text-yellow-dark-2 border border-yellow-light-1",
        danger:    "bg-red-light-6 text-red-dark border border-red-light-4",
        info:      "bg-blue-light-5 text-blue border border-blue-light-4",
      },
      size: {
        sm: "px-2 py-0 text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full shrink-0", {
            "bg-blue":       variant === "primary" || variant === "info",
            "bg-green":      variant === "success",
            "bg-yellow-dark": variant === "warning",
            "bg-red":        variant === "danger",
            "bg-dark-4":     variant === "default",
          })}
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
