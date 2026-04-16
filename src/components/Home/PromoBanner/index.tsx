import Image from "next/image";
import React from "react";

const PromoBanner = () => {
  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-292.5 w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- promo banner big --> */}
        <div className="relative z-1 overflow-hidden rounded-lg bg-[#F5F5F7] py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5">
          <div className="max-w-137.5 w-full">
            <span className="block font-medium text-xl text-dark mb-3">
              Samsung Galaxy S24 Ultra
            </span>

            <h2 className="font-bold text-xl lg:text-heading-4 xl:text-heading-3 text-dark mb-5">
              HASTA 30% DE DESCUENTO
            </h2>

            <p>
              El S24 Ultra lleva la fotografia movil al siguiente nivel con su
              camara de 200 MP y el S Pen integrado. Potencia sin limites.
            </p>
            {/*’s in iPhone 13 Pro,
*/}
            <a
              href="/tienda"
              className="inline-flex font-medium text-custom-sm text-white bg-blue py-2.75 px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
            >
              Comprar ahora
            </a>
          </div>

          <Image
            src="/images/promo/promo-01.png"
            alt="Samsung Galaxy S24 Ultra"
            className="absolute bottom-0 right-4 lg:right-26 -z-1"
            width={274}
            height={350}
          />
        </div>

        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
          {/* <!-- promo banner small --> */}
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#DBF4F3] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
            <Image
              src="/images/promo/promo-02.png"
              alt="promo img"
              className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-10 -z-1"
              width={241}
              height={241}
            />

            <div className="text-right">
              <span className="block text-lg text-dark mb-1.5">
                iPhone 14 · Reacondicionado
              </span>

              <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                Desde 499€
              </h2>

              <p className="font-semibold text-custom-1 text-teal">
                Garantía 12 meses incluida
              </p>

              <a
                href="/tienda"
                className="inline-flex font-medium text-custom-sm text-white bg-teal py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-teal-dark mt-9"
              >
                Ver ofertas
              </a>
            </div>
          </div>

          {/* <!-- promo banner small --> */}
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#FFECE1] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
            <Image
              src="/images/promo/promo-03.png"
              alt="promo img"
              className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-8.5 -z-1"
              width={200}
              height={200}
            />

            <div>
              <span className="block text-lg text-dark mb-1.5">
                Apple iPad Pro M4
              </span>

              <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                Hasta <span className="text-orange">20%</span> de descuento
              </h2>

              <p className="max-w-71.25 text-custom-sm">
                Pantalla OLED Ultra Retina XDR de 11&quot;. El iPad más potente
                jamás creado.
              </p>

              <a
                href="/tienda"
                className="inline-flex font-medium text-custom-sm text-white bg-orange py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-orange-dark mt-7.5"
              >
                Comprar ahora
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
