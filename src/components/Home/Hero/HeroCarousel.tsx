"use client";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";

const HeroCarousal = () => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      <SwiperSlide>
        <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
            <span className="inline-block font-semibold text-xs text-blue bg-blue/10 rounded px-2.5 py-1 mb-6 uppercase tracking-wider">
              Reacondicionado · 12 meses de garantía
            </span>

            <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
              <a href="/tienda?brand=Apple&category=smartphone">
                iPhone 15 Pro — Titanio, chip A17 Pro
              </a>
            </h1>

            <p className="text-dark-4">
              Cámara de 48 MP, USB-C y batería de larga duración.
              Reacondicionado en estado excelente con garantía incluida.
            </p>

            <a
              href="/tienda?brand=Apple&category=smartphone"
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
            >
              Ver iPhone
            </a>
          </div>

          <div>
            <Image
              src="/images/hero/hero-02.png"
              alt="iPhone 15 Pro"
              width={351}
              height={358}
            />
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[394px] py-10 sm:py-15 lg:py-26 pl-4 sm:pl-7.5 lg:pl-12.5">
            <span className="inline-block font-semibold text-xs text-blue bg-blue/10 rounded px-2.5 py-1 mb-6 uppercase tracking-wider">
              Reacondicionado · 12 meses de garantía
            </span>

            <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
              <a href="/tienda?brand=Samsung&category=smartphone">
                Samsung Galaxy S24 Ultra — S Pen incluido
              </a>
            </h1>

            <p className="text-dark-4">
              Pantalla Dynamic AMOLED 2X de 6,8&quot;, cámara de 200 MP y S Pen
              integrado. La experiencia Android más completa del mercado.
            </p>

            <a
              href="/tienda?brand=Samsung&category=smartphone"
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
            >
              Ver Samsung
            </a>
          </div>

          <div>
            <Image
              src="/images/hero/hero-01.png"
              alt="Samsung Galaxy S24 Ultra"
              width={351}
              height={358}
            />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HeroCarousal;
