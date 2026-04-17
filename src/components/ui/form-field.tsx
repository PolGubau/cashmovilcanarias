import { cn } from "@/lib/utils";
import type React from "react";
import { Label } from "./label";

interface FormFieldProps {
  /** Texto del label */
  label: string;
  /** Debe coincidir con el id del input hijo */
  htmlFor: string;
  required?: boolean;
  /** Mensaje de error bajo el campo */
  error?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Wrapper semántico Label + campo + mensaje de error.
 *
 * Uso:
 * ```tsx
 * <FormField label="Email" htmlFor="email" required>
 *   <Input type="email" id="email" name="email" />
 * </FormField>
 * ```
 */
const FormField = ({
  label,
  htmlFor,
  required,
  error,
  className,
  children,
}: FormFieldProps) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <Label htmlFor={htmlFor} required={required}>
      {label}
    </Label>
    {children}
    {error && (
      <p className="text-xs text-red" role="alert">
        {error}
      </p>
    )}
  </div>
);

export { FormField };
export type { FormFieldProps };
