import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva("animate-spin rounded-full border-2 border-current border-t-transparent shrink-0", {
  variants: {
    size: {
      sm:  "h-4 w-4",
      md:  "h-5 w-5",
      lg:  "h-6 w-6",
      xl:  "h-8 w-8",
    },
    color: {
      primary:     "text-blue",
      white:       "text-white",
      muted:       "text-dark-4",
      destructive: "text-red",
    },
  },
  defaultVariants: { size: "md", color: "primary" },
});

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  label?: string;
}

export function Spinner({ size, color, className, label = "Cargando..." }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={cn(spinnerVariants({ size, color }), className)} />
  );
}

export function PageSpinner() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
