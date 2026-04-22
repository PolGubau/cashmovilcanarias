import type { ProductFull } from "@/lib/supabase/types";
import Image from "next/image";
import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";

interface Props {
  products: ProductFull[];
}

const FALLBACK_IMAGE = "/images/hero/hero-02.png";

const Hero = ({ products }: Props) => {
  const highlight1 = products[0] ?? null;
  const highlight2 = products[1] ?? null;

  const highlightHref = (p: ProductFull) =>
    `/tienda?brand=${encodeURIComponent(p.brand)}&category=${p.category ?? "smartphone"}`;

  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-8 sm:pt-10 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
                priority
                loading="eager"
              />
              <HeroCarousel products={products} />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              {highlight1 && (
                <a
                  href={highlightHref(highlight1)}
                  className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex-1 min-w-0">
                      <span className="text-2xs font-semibold text-blue uppercase tracking-wider block mb-1">
                        {highlight1.total_stock > 0 ? "En stock" : "Reacondicionado"}
                      </span>
                      <h2 className="font-semibold text-dark text-lg leading-snug mb-1 line-clamp-2">
                        {highlight1.name}
                      </h2>
                      {highlight1.price_from != null && (
                        <span className="text-sm font-medium text-blue">
                          Desde {highlight1.price_from.toFixed(2)} €
                        </span>
                      )}
                    </div>
                    <Image
                      src={highlight1.primary_image_url ?? FALLBACK_IMAGE}
                      alt={highlight1.name}
                      width={72}
                      height={96}
                      className="shrink-0 object-contain"
                      quality={90}
                    />
                  </div>
                </a>
              )}
              {highlight2 && (
                <a
                  href={highlightHref(highlight2)}
                  className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex-1 min-w-0">
                      <span className="text-2xs font-semibold text-blue uppercase tracking-wider block mb-1">
                        {highlight2.total_stock > 0 ? "En stock" : "Reacondicionado"}
                      </span>
                      <h2 className="font-semibold text-dark text-lg leading-snug mb-1 line-clamp-2">
                        {highlight2.name}
                      </h2>
                      {highlight2.price_from != null && (
                        <span className="text-sm font-medium text-blue">
                          Desde {highlight2.price_from.toFixed(2)} €
                        </span>
                      )}
                    </div>
                    <Image
                      src={highlight2.primary_image_url ?? FALLBACK_IMAGE}
                      alt={highlight2.name}
                      width={72}
                      height={96}
                      className="shrink-0 object-contain"
                      quality={90}
                    />
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <HeroFeature />
    </section>
  );
};

export default Hero;
