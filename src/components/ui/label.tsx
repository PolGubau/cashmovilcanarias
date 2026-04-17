"use client";

import { cn } from "@/lib/utils";
import { Label as LabelPrimitive } from "radix-ui";
import type * as React from "react";

type LabelProps = React.ComponentPropsWithRef<typeof LabelPrimitive.Root> & { required?: boolean };

const Label = ({ className, children, required, ...props }: LabelProps) => (
  <LabelPrimitive.Root
    className={cn(
      "text-sm font-medium text-dark-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...props}
  >
    {children}
    {required && <span className="ml-0.5 text-red">*</span>}
  </LabelPrimitive.Root>
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
