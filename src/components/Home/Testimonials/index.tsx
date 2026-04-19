"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import testimonialsData from "./testimonialsData";

// Import Swiper styles
import "swiper/css/navigation";
import "swiper/css";
import SingleItem from "./SingleItem";

const Testimonials = () => {
  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  return (
    <section className="overflow-hidden pb-16.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="">
          <div className="swiper testimonial-carousel common-carousel p-5">
            {/* <!-- section title --> */}
            <div className="mb-10 flex items-center justify-between">
              <div>
                <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
                  <Image
                    src="/images/icons/icon-08.svg"
                    alt="icon"
                    width={17}
                    height={17}
                  />
                  Testimonios
                </span>
                <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
                  Lo que dicen nuestros clientes
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div onClick={handlePrev} className="swiper-button-prev">
                  <ChevronLeft className="size-6" />
                </div>

                <div onClick={handleNext} className="swiper-button-next">
                  <ChevronRight className="size-6" />
                </div>
              </div>
            </div>

            <Swiper
              ref={sliderRef}
              slidesPerView={3}
              spaceBetween={20}
              breakpoints={{
                // when window width is >= 640px
                0: {
                  slidesPerView: 1,
                },
                1000: {
                  slidesPerView: 2,
                  // spaceBetween: 4,
                },
                // when window width is >= 768px
                1200: {
                  slidesPerView: 3,
                },
              }}
            >
              {testimonialsData.map((item, key) => (
                <SwiperSlide key={key}>
                  <SingleItem testimonial={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
