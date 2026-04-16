import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toast";
import "../../css/style.css";

export const metadata: Metadata = {
  title: "Login | CashMóvil Canarias",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
