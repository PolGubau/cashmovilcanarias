import type { ProductFull } from "@/lib/supabase/types";
import Newsletter from "../Common/Newsletter";
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
      <Newsletter />
    </main>
  );
};

export default Home;
