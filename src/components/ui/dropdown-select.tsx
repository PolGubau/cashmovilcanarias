"use client";

import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";
import * as React from "react";

export type DropdownSelectOption = {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
};

type DropdownSelectProps = {
  options: DropdownSelectOption[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  align?: React.ComponentProps<typeof PopoverPrimitive.Content>["align"];
  sideOffset?: number;
};

export function DropdownSelect({
  options,
  defaultValue,
  value,
  onValueChange,
  className,
  triggerClassName,
  contentClassName,
  itemClassName,
  align = "start",
  sideOffset = 8,
}: DropdownSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? options[0]?.value ?? "",
  );

  const selectedValue = value ?? internalValue;
  const selectedOption =
    options.find((option) => option.value === selectedValue) ?? options[0];

  const handleValueChange = (nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
    setOpen(false);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex w-full items-center justify-between gap-2 whitespace-nowrap rounded-md border border-gray-3 bg-white text-left text-sm text-dark outline-none transition-colors",
            "focus-visible:border-blue focus-visible:ring-2 focus-visible:ring-blue/20",
            "disabled:pointer-events-none disabled:opacity-50",
            className,
            triggerClassName,
          )}
        >
          <span className="truncate">{selectedOption?.label ?? "Select..."}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-current/60 transition-transform duration-200" />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "z-99999 w-[var(--radix-popover-trigger-width)] rounded-md border border-gray-3 bg-white p-2.5 shadow-2 outline-none",
            "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
            contentClassName,
          )}
        >
          <div className="flex flex-col gap-0.5">
            {options.map((option) => {
              const isSelected = option.value === selectedValue;

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => handleValueChange(option.value)}
                  className={cn(
                    "flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm transition-colors",
                    "hover:bg-gray-1 hover:text-dark",
                    isSelected && "bg-gray-1 text-dark",
                    option.disabled && "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-dark-3",
                    itemClassName,
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
