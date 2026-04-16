import { cn } from "@/lib/utils";
import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, leftAddon, rightAddon, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center">
          {leftAddon && (
            <span className="pointer-events-none absolute left-3 flex items-center text-dark-4">
              {leftAddon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              "flex h-9 w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark placeholder:text-dark-5",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-1",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              error && "border-red focus:ring-red/20 focus:border-red",
              leftAddon && "pl-9",
              rightAddon && "pr-9",
              className,
            )}
            {...props}
          />
          {rightAddon && (
            <span className="pointer-events-none absolute right-3 flex items-center text-dark-4">
              {rightAddon}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-red">{error}</p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
