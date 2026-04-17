import { cn } from "@/lib/utils";
import type * as React from "react";

export interface TextareaProps extends React.ComponentPropsWithRef<"textarea"> {
  error?: string;
}

const Textarea = ({ className, error, ...props }: TextareaProps) => {
  return (
    <div className="w-full">
      <textarea
        className={cn(
          "flex min-h-20 w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark placeholder:text-dark-5",
          "transition-colors focus:outline-none focus:ring-2",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-1 resize-none",
          error ? "border-red focus:ring-red/20 focus:border-red" : "focus:ring-blue/20 focus:border-blue",
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red">{error}</p>}
    </div>
  );
};
Textarea.displayName = "Textarea";

export { Textarea };
