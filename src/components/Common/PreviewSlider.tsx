"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css";
import Image from "next/image";

import { useUIStore } from "@/store/ui.store";

const PreviewSliderModal = () => {
  const { closePreviewSlider, isPreviewSliderOpen, previewProduct } = useUIStore();

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
    <div
      className={`preview-slider w-full h-screen  z-999999 inset-0 flex justify-center items-center bg-[#000000F2] bg-opacity-70 ${isPreviewSliderOpen ? "fixed" : "hidden"
        }`}
    >
      <Button
        size="icon"
        variant="ghost"
        onClick={() => closePreviewSlider()}
        aria-label="Cerrar preview"
        className="absolute top-0 right-0 sm:top-6 sm:right-6 w-10 h-10 rounded-full text-white hover:text-meta-5 hover:bg-transparent z-10"
      >
        <X className="size-9" />
      </Button>

      <div>
        <Button
          size="icon"
          variant="ghost"
          onClick={handlePrev}
          aria-label="Anterior"
          className="rotate-180 absolute left-100 p-5 w-auto h-auto rounded-full text-white hover:bg-white/20 z-10"
        >
          <ArrowRight className="size-9 rotate-180" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={handleNext}
          aria-label="Siguiente"
          className="absolute right-100 p-5 w-auto h-auto rounded-full text-white hover:bg-white/20 z-10"
        >
          <ArrowRight className="size-9" />
        </Button>
      </div>

      <Swiper ref={sliderRef} slidesPerView={1} spaceBetween={20}>
        <SwiperSlide>
          <div className="flex justify-center items-center">
            <Image
              src={"/images/products/product-2-bg-1.png"}
              alt={"product image"}
              width={450}
              height={450}
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex justify-center items-center">
            <Image
              src={"/images/products/product-2-bg-1.png"}
              alt={"product image"}
              width={450}
              height={450}
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default PreviewSliderModal;
