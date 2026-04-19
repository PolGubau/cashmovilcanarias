"use client";
import { useEffect, useState } from "react";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

import CartSidebarModal from "@/components/Common/CartSidebarModal";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import QuickViewModal from "@/components/Common/QuickViewModal";

import PreLoader from "@/components/Common/PreLoader";
import ScrollToTop from "@/components/Common/ScrollToTop";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="es" suppressHydrationWarning={true}>
      <body>
        {loading ? (
          <PreLoader />
        ) : (
          <>
            <>
              <Header />
              <main style={{ paddingTop: "var(--header-height, 120px)" }}>
                {children}
              </main>
              <QuickViewModal />
              <CartSidebarModal />
              <PreviewSliderModal />
            </>
            <Toaster position="top-right" />
            <ScrollToTop />
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
