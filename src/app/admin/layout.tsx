import AdminSidebar from "@/components/admin/Sidebar";
import { Toaster } from "@/components/ui/toast";
import type { Metadata } from "next";
import "../css/style.css";

export const metadata: Metadata = {
  title: "CashMóvil Canarias | Panel Admin",
  description: "Sistema de gestión de compraventa y reparación de móviles",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-1">
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 ml-64 p-8 overflow-auto">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
