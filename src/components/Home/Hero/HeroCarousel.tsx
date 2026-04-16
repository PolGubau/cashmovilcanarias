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
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                30%
              </span>
              <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                de
                <br />
                descuento
              </span>
            </div>

            <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
              <a href="/tienda">iPhone 15 Pro — Titanio, chip A17 Pro</a>
            </h1>

            <p>
              El iPhone más avanzado jamás creado. Cámara de 48 MP, USB-C y
              batería de larga duración. Reacondicionado con garantía de 12 meses.
            </p>

            <a
              href="/tienda"
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
            >
              Ver ofertas
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
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                20%
              </span>
              <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                de
                <br />
                descuento
              </span>
            </div>

            <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
              <a href="/tienda">Samsung Galaxy S24 Ultra — S Pen incluido</a>
            </h1>

            <p>
              Pantalla Dynamic AMOLED 2X de 6,8&quot;, cámara de 200 MP y S Pen
              integrado. La experiencia Android más completa del mercado.
            </p>

            <a
              href="/tienda"
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
            >
              Ver ofertas
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
