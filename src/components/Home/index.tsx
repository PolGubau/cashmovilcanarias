import type { ProductFull } from "@/lib/supabase/types";
import BestSeller from "./BestSeller";
import Categories from "./Categories";
import Hero from "./Hero";
import NewArrival from "./NewArrivals";

const Home = ({ products }: { products: ProductFull[] }) => {
  return (
    <main>
      <Hero products={products} />
      <Categories />
      <NewArrival products={products} />
      <BestSeller products={products} />
    </main>
  );
};

export default Home;
