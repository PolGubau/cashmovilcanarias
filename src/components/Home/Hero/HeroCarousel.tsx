"use client";
import type { ProductFull } from "@/lib/supabase/types";
import Image from "next/image";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

interface Props {
  products: ProductFull[];
}

const FALLBACK_IMAGE = "/images/hero/hero-02.png";

const HeroCarousel = ({ products }: Props) => {
  const slides = products.length > 0 ? products.slice(0, 5) : [];

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-dark-4 text-sm">
        No hay productos disponibles
      </div>
    );
  }

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {slides.map((product) => {
        const href = `/tienda?brand=${encodeURIComponent(product.brand)}&category=${product.category ?? "smartphone"}`;
        const imgSrc = product.primary_image_url ?? FALLBACK_IMAGE;
        const warranty = product.warranty_months > 0
          ? `${product.warranty_months} meses de garantía`
          : "Sin garantía";

        return (
          <SwiperSlide key={product.id}>
            <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
              <div className="max-w-98.5 py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
                <span className="inline-block font-semibold text-xs text-blue bg-blue/10 rounded px-2.5 py-1 mb-6 uppercase tracking-wider">
                  {product.total_stock > 0 ? "En stock" : "Reacondicionado"} · {warranty}
                </span>

                <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
                  <a href={href}>{product.name}</a>
                </h1>

                {product.description && (
                  <p className="text-dark-4 line-clamp-3">
                    {product.description}
                  </p>
                )}

                {product.price_from != null && (
                  <p className="mt-3 text-lg font-semibold text-blue">
                    Desde {product.price_from.toFixed(2)} €
                  </p>
                )}

                <a
                  href={href}
                  className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-8"
                >
                  Ver {product.brand}
                </a>
              </div>

              <div className="shrink-0">
                <Image
                  src={imgSrc}
                  alt={product.name}
                  width={300}
                  height={360}
                  className="object-contain h-[220px] sm:h-[300px] w-auto"
                  quality={90}
                />
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default HeroCarousel;
