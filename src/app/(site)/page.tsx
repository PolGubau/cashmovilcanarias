import Home from "@/components/Home";
import { getProducts } from "@/lib/actions/products";
import type { ProductFull } from "@/lib/supabase/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CashMóvil Canarias | Móviles reacondicionados",
  description: "Compra y vende móviles reacondicionados en Canarias. iPhone, Samsung, Xiaomi y más con garantía.",
};

export default async function HomePage() {
  const products = await getProducts({ published: true }).catch(
    (): ProductFull[] => [],
  );

  return <Home products={products} />;
}
