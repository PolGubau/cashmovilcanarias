import Home from "@/components/Home";
import { getProducts } from "@/lib/actions/products";
import type { ProductFull } from "@/lib/supabase/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextCommerce | Nextjs E-commerce template",
  description: "This is Home for NextCommerce Template",
};

export default async function HomePage() {
  const products = await getProducts({ published: true }).catch(
    (): ProductFull[] => [],
  );

  return <Home products={products} />;
}
