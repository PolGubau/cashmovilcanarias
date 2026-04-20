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
    <html lang="es" data-scroll-behavior="smooth">
      <body className="bg-[#f8f9fb]">
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 lg:ml-60 min-h-screen">
            {/* Top bar */}
            <div className="h-16 border-b border-gray-200 bg-white px-4 sm:px-8 flex items-center sticky top-0 z-30">
              <div className="flex items-center gap-2 text-sm text-gray-400 pl-10 lg:pl-0">
                <span className="font-medium text-gray-700">CashMóvil Canarias</span>
              </div>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
