import { cn } from "@/lib/utils";
import type * as React from "react";

type CardProps = React.ComponentPropsWithRef<"div">;
type CardTitleProps = React.ComponentPropsWithRef<"h3">;
type CardDescriptionProps = React.ComponentPropsWithRef<"p">;

const Card = ({ className, ...props }: CardProps) => (
  <div
    className={cn("rounded-xl border border-gray-3 bg-white shadow-1", className)}
    {...props}
  />
);
Card.displayName = "Card";

const CardHeader = ({ className, ...props }: CardProps) => (
  <div className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />
);
CardHeader.displayName = "CardHeader";

const CardTitle = ({ className, ...props }: CardTitleProps) => (
  <h3 className={cn("text-base font-semibold text-dark", className)} {...props} />
);
CardTitle.displayName = "CardTitle";

const CardDescription = ({ className, ...props }: CardDescriptionProps) => (
  <p className={cn("text-sm text-dark-4", className)} {...props} />
);
CardDescription.displayName = "CardDescription";

const CardContent = ({ className, ...props }: CardProps) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

const CardFooter = ({ className, ...props }: CardProps) => (
  <div className={cn("flex items-center p-6 pt-0 gap-3", className)} {...props} />
);
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
