import type { ProductFull } from "@/lib/supabase/types";
import React from "react";
import Newsletter from "../Common/Newsletter";
import BestSeller from "./BestSeller";
import Categories from "./Categories";
import CounDown from "./Countdown";
import Hero from "./Hero";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import Testimonials from "./Testimonials";

const Home = ({ products }: { products: ProductFull[] }) => {
  return (
    <main>
      <Hero />
      <Categories />
      <NewArrival products={products} />
      <PromoBanner products={products.slice(0, 3)} />
      <BestSeller products={products} />
      <CounDown />
      <Testimonials />
      <Newsletter />
    </main>
  );
};

export default Home;
