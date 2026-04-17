"use client";

import { cn } from "@/lib/utils";
import { Separator as SeparatorPrimitive } from "radix-ui";
import type * as React from "react";

type SeparatorProps = React.ComponentPropsWithRef<typeof SeparatorPrimitive.Root>;

const Separator = ({ className, orientation = "horizontal", decorative = true, ...props }: SeparatorProps) => (
  <SeparatorPrimitive.Root
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-gray-3",
      orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
      className,
    )}
    {...props}
  />
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
