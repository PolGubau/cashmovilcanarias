import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { Button } from "./button";

interface QuantityStepperProps {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  /** outline: botones agrupados con borde exterior (default). separated: botones individuales con fondo propio */
  variant?: "outline" | "separated";
  /** sm=36px · md=40px · lg=46px · xl=48px */
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: { btn: "w-9 h-9", display: "w-12 h-9", icon: "w-3.5 h-3.5" },
  md: { btn: "w-10 h-10", display: "w-16 h-10", icon: "w-4 h-4" },
  lg: { btn: "w-11.5 h-11.5", display: "w-16 h-11.5", icon: "w-4 h-4" },
  xl: { btn: "w-12 h-12", display: "w-16 h-12", icon: "w-4 h-4" },
};

const QuantityStepper = ({
  value,
  onIncrease,
  onDecrease,
  min = 1,
  max,
  variant = "outline",
  size = "md",
  className,
}: QuantityStepperProps) => {
  const { btn, display, icon } = sizeMap[size];
  const canDecrease = value > min;
  const canIncrease = max === undefined || value < max;

  if (variant === "separated") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <Button
          type="button"
          variant="secondary"
          onClick={onDecrease}
          disabled={!canDecrease}
          aria-label="Reducir cantidad"
          className={cn("rounded-[5px]", btn)}
        >
          <Minus className={icon} />
        </Button>

        <span className={cn(
          "flex items-center justify-center rounded-[5px] border border-gray-4 bg-white font-medium text-dark",
          display,
        )}>
          {value}
        </span>

        <Button
          type="button"
          variant="secondary"
          onClick={onIncrease}
          disabled={!canIncrease}
          aria-label="Aumentar cantidad"
          className={cn("rounded-[5px]", btn)}
        >
          <Plus className={icon} />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center w-max rounded-md border border-gray-3", className)}>
      <Button
        type="button"
        variant="ghost"
        onClick={onDecrease}
        disabled={!canDecrease}
        aria-label="Reducir cantidad"
        className={cn("rounded-none rounded-l-md hover:text-blue", btn)}
      >
        <Minus className={icon} />
      </Button>

      <span className={cn(
        "flex items-center justify-center border-x border-gray-4 font-medium text-dark",
        display,
      )}>
        {value}
      </span>

      <Button
        type="button"
        variant="ghost"
        onClick={onIncrease}
        disabled={!canIncrease}
        aria-label="Aumentar cantidad"
        className={cn("rounded-none rounded-r-md hover:text-blue", btn)}
      >
        <Plus className={icon} />
      </Button>
    </div>
  );
};

export { QuantityStepper };
export type { QuantityStepperProps };
