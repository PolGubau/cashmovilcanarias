import ProductItem from "@/components/Common/ProductItem";
import type { ProductFull } from "@/lib/supabase/types";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const NewArrival = ({ products }: { products: ProductFull[] }) => {
  return (
    <section className="overflow-hidden pt-15">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="mb-7 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
              <ShoppingBag className="size-5 text-blue" />
              Novedades de la semana
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              Nuevas llegadas
            </h2>
          </div>

          <Link
            href="/tienda"
            className="inline-flex font-medium text-custom-sm py-2.5 px-7 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            Ver todo
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
          {/* <!-- New Arrivals item --> */}
          {products.map((item) => (
            <ProductItem item={item} key={item.id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrival;
