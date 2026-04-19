import Image from "next/image";
import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";

const Hero = () => {
  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-8 sm:pt-10 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              {/* <!-- bg shapes --> */}
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
              />

              <HeroCarousel />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              <a
                href="/tienda?brand=Apple&category=smartphone"
                className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-6">
                  <div className="flex-1 min-w-0">
                    <span className="text-2xs font-semibold text-blue uppercase tracking-wider block mb-1">
                      Reacondicionado
                    </span>
                    <h2 className="font-semibold text-dark text-lg leading-snug mb-3">
                      iPhone 15 Pro — Titanio
                    </h2>
                    <span className="text-sm text-dark-4">
                      Con garantía incluida
                    </span>
                  </div>
                  <Image
                    src="/images/hero/hero-02.png"
                    alt="iPhone 15 Pro"
                    width={100}
                    height={131}
                    className="shrink-0"
                  />
                </div>
              </a>
              <a
                href="/tienda?category=tablet"
                className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-6">
                  <div className="flex-1 min-w-0">
                    <span className="text-2xs font-semibold text-blue uppercase tracking-wider block mb-1">
                      Reacondicionado
                    </span>
                    <h2 className="font-semibold text-dark text-lg leading-snug mb-3">
                      iPad Pro M4 — 11&quot;
                    </h2>
                    <span className="text-sm text-dark-4">
                      Con garantía incluida
                    </span>
                  </div>
                  <Image
                    src="/images/hero/hero-01.png"
                    alt="iPad Pro M4"
                    width={100}
                    height={131}
                    className="shrink-0"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Hero features --> */}
      <HeroFeature />
    </section>
  );
};

export default Hero;
