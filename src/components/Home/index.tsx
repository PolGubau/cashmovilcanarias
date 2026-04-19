import type { ProductFull } from "@/lib/supabase/types";
import BestSeller from "./BestSeller";
import Categories from "./Categories";
import Hero from "./Hero";
import NewArrival from "./NewArrivals";
import Testimonials from "./Testimonials";

const Home = ({ products }: { products: ProductFull[] }) => {
  return (
    <main>
      <Hero />
      <Categories />
      <NewArrival products={products} />
      <BestSeller products={products} />
      <Testimonials />
    </main>
  );
};

export default Home;
