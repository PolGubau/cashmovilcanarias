import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-blue text-white hover:bg-blue-dark active:bg-blue-dark shadow-sm",
        secondary:
          "bg-gray-2 text-dark hover:bg-gray-3 active:bg-gray-3 border border-gray-3",
        outline:
          "border border-gray-3 bg-white text-dark hover:bg-gray-1 active:bg-gray-2",
        ghost: "text-dark hover:bg-gray-1 active:bg-gray-2",
        destructive:
          "bg-red text-white hover:bg-red-dark active:bg-red-dark shadow-sm",
        success:
          "bg-green text-white hover:bg-green-dark active:bg-green-dark shadow-sm",
        link: "text-blue underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4",
        lg: "h-10 px-5 text-base",
        xl: "h-12 px-6 text-base",
        icon: "h-9 w-9 p-0",
        "icon-sm": "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = (
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }: ButtonProps) => {
    return (
      <button
        type={props.type ?? "button"}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled ?? loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

export { Button, buttonVariants };
