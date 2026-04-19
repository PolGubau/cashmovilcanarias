"use client";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui.store";
import { Check, CheckCircle2, Heart, Maximize2, Minus, Plus, Star } from "lucide-react";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import RecentlyViewdItems from "./RecentlyViewd";

const ShopDetails = () => {
  const [activeColor, setActiveColor] = useState("blue");
  const { openPreviewSlider, previewProduct } = useUIStore();
  const [previewImg, setPreviewImg] = useState(0);

  const [storage, setStorage] = useState("gb128");
  const [type, setType] = useState("active");
  const [sim, setSim] = useState("dual");
  const [quantity, setQuantity] = useState(1);

  const [activeTab, setActiveTab] = useState("tabOne");

  const storages = [
    {
      id: "gb128",
      title: "128 GB",
    },
    {
      id: "gb256",
      title: "256 GB",
    },
    {
      id: "gb512",
      title: "521 GB",
    },
  ];

  const types = [
    {
      id: "active",
      title: "Active",
    },

    {
      id: "inactive",
      title: "Inactive",
    },
  ];

  const sims = [
    {
      id: "dual",
      title: "Dual",
    },

    {
      id: "e-sim",
      title: "E Sim",
    },
  ];

  const tabs = [
    {
      id: "tabOne",
      title: "Description",
    },
    {
      id: "tabTwo",
      title: "Additional Information",
    },
    {
      id: "tabThree",
      title: "Reviews",
    },
  ];

  const colors = ["red", "blue", "orange", "pink", "purple"];

  const alreadyExist = localStorage.getItem("productDetails");
  const product = alreadyExist ? JSON.parse(alreadyExist) : previewProduct;

  useEffect(() => {
    localStorage.setItem("productDetails", JSON.stringify(product));
  }, [product]);

  // pass the product here when you get the real data.
  const handlePreviewSlider = () => {
    openPreviewSlider(product);
  };

  return (
    <>
      <Breadcrumb title={"Shop Details"} pages={["shop details"]} />

      {product.title === "" ? (
        "Please add product"
      ) : (
        <>
          <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
              <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
                <div className="lg:max-w-[570px] w-full">
                  <div className="lg:min-h-[512px] rounded-lg shadow-1 bg-gray-2 p-4 sm:p-7.5 relative flex items-center justify-center">
                    <div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handlePreviewSlider}
                        aria-label="Ampliar imagen"
                        className="gallery__Image w-11 h-11 rounded-[5px] bg-gray-1 shadow-1 text-dark hover:text-blue hover:bg-gray-1 absolute top-4 lg:top-6 right-4 lg:right-6 z-50"
                      >
                        <Maximize2 className="size-[22px]" />
                      </Button>

                      {product.imgs?.previews?.[previewImg] && (
                        <Image
                          src={product.imgs.previews[previewImg]}
                          alt="products-details"
                          width={400}
                          height={400}
                        />
                      )}
                    </div>
                  </div>

                  {/* ?  &apos;border-blue &apos; :  &apos;border-transparent&apos; */}
                  <div className="flex flex-wrap sm:flex-nowrap gap-4.5 mt-6">
                    {product.imgs?.thumbnails.map((item, key) => (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setPreviewImg(key)}
                        key={key}
                        aria-label={`Imagen ${key + 1}`}
                        className={`w-15 sm:w-25 h-15 sm:h-25 overflow-hidden rounded-lg bg-gray-2 shadow-1 ease-out duration-200 border-2 hover:border-blue hover:bg-gray-2 ${key === previewImg
                          ? "border-blue"
                          : "border-transparent"
                          }`}
                      >
                        <Image
                          width={50}
                          height={50}
                          src={item}
                          alt="thumbnail"
                        />
                      </Button>
                    ))}
                  </div>
                </div>

                {/* <!-- product content --> */}
                <div className="max-w-[539px] w-full">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-xl sm:text-2xl xl:text-custom-3 text-dark">
                      {product.title}
                    </h2>

                    <div className="inline-flex font-medium text-custom-sm text-white bg-blue rounded py-0.5 px-2.5">
                      30% OFF
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-5.5 mb-4.5">
                    <div className="flex items-center gap-2.5">
                      {/* <!-- stars --> */}
                      <div className="flex items-center gap-1">
                        <Star className="size-[18px] fill-[#FFA645] text-[#FFA645]" />
                        <Star className="size-[18px] fill-[#FFA645] text-[#FFA645]" />
                        <Star className="size-[18px] fill-[#FFA645] text-[#FFA645]" />
                        <Star className="size-[18px] fill-[#FFA645] text-[#FFA645]" />
                        <Star className="size-[18px] fill-[#FFA645] text-[#FFA645]" />
                      </div>

                      <span> (5 customer reviews) </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-5 text-[#22AD5C]" />
                      <span className="text-green"> In Stock </span>
                    </div>
                  </div>

                  <h3 className="font-medium text-custom-1 mb-4.5">
                    <span className="text-sm sm:text-base text-dark">
                      Price: ${product.price}
                    </span>
                    <span className="line-through">
                      {" "}
                      ${product.discountedPrice}{" "}
                    </span>
                  </h3>

                  <ul className="flex flex-col gap-2">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-5 text-blue" />
                      Free delivery available
                    </li>

                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-5 text-blue" />
                      Sales 30% Off Use Code: PROMO30
                    </li>
                  </ul>

                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col gap-4.5 border-y border-gray-3 mt-7.5 mb-9 py-9">
                      {/* <!-- details item --> */}
                      <div className="flex items-center gap-4">
                        <div className="min-w-[65px]">
                          <h4 className="font-medium text-dark">Color:</h4>
                        </div>

                        <div className="flex items-center gap-2.5">
                          {colors.map((color, key) => (
                            <label
                              key={key}
                              htmlFor={color}
                              className="cursor-pointer select-none flex items-center"
                            >
                              <div className="relative">
                                <input
                                  type="radio"
                                  name="color"
                                  id={color}
                                  className="sr-only"
                                  onChange={() => setActiveColor(color)}
                                />
                                <div
                                  className={`flex items-center justify-center w-5.5 h-5.5 rounded-full ${activeColor === color && "border"
                                    }`}
                                  style={{ borderColor: `${color}` }}
                                >
                                  <span
                                    className="block size-3 rounded-full"
                                    style={{ backgroundColor: `${color}` }}
                                  />
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* <!-- details item --> */}
                      <div className="flex items-center gap-4">
                        <div className="min-w-[65px]">
                          <h4 className="font-medium text-dark">Storage:</h4>
                        </div>

                        <div className="flex items-center gap-4">
                          {storages.map((item, key) => (
                            <label
                              key={key}
                              htmlFor={item.id}
                              className="flex cursor-pointer select-none items-center"
                            >
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  name="storage"
                                  id={item.id}
                                  className="sr-only"
                                  onChange={() => setStorage(item.id)}
                                />

                                {/*  */}
                                <div
                                  className={`mr-2 flex h-4 w-4 items-center justify-center rounded border ${storage === item.id
                                    ? "border-blue bg-blue"
                                    : "border-gray-4"
                                    } `}
                                >
                                  <span
                                    className={
                                      storage === item.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    }
                                  >
                                    <Check className="size-4 text-white" strokeWidth={3} />
                                  </span>
                                </div>
                              </div>
                              {item.title}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* // <!-- details item --> */}
                      <div className="flex items-center gap-4">
                        <div className="min-w-[65px]">
                          <h4 className="font-medium text-dark">Type:</h4>
                        </div>

                        <div className="flex items-center gap-4">
                          {types.map((item, key) => (
                            <label
                              key={key}
                              htmlFor={item.id}
                              className="flex cursor-pointer select-none items-center"
                            >
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  name="storage"
                                  id={item.id}
                                  className="sr-only"
                                  onChange={() => setType(item.id)}
                                />

                                {/*  */}
                                <div
                                  className={`mr-2 flex h-4 w-4 items-center justify-center rounded border ${type === item.id
                                    ? "border-blue bg-blue"
                                    : "border-gray-4"
                                    } `}
                                >
                                  <span
                                    className={
                                      type === item.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    }
                                  >
                                    <Check className="size-4 text-white" strokeWidth={3} />
                                  </span>
                                </div>
                              </div>
                              {item.title}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* // <!-- details item --> */}
                      <div className="flex items-center gap-4">
                        <div className="min-w-[65px]">
                          <h4 className="font-medium text-dark">Sim:</h4>
                        </div>

                        <div className="flex items-center gap-4">
                          {sims.map((item, key) => (
                            <label
                              key={key}
                              htmlFor={item.id}
                              className="flex cursor-pointer select-none items-center"
                            >
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  name="storage"
                                  id={item.id}
                                  className="sr-only"
                                  onChange={() => setSim(item.id)}
                                />

                                {/*  */}
                                <div
                                  className={`mr-2 flex h-4 w-4 items-center justify-center rounded border ${sim === item.id
                                    ? "border-blue bg-blue"
                                    : "border-gray-4"
                                    } `}
                                >
                                  <span
                                    className={
                                      sim === item.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    }
                                  >
                                    <Check className="size-4 text-white" strokeWidth={3} />
                                  </span>
                                </div>
                              </div>
                              {item.title}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4.5">
                      <div className="flex items-center rounded-md border border-gray-3">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Reducir cantidad"
                          className="w-12 h-12 rounded-none hover:text-blue hover:bg-transparent"
                          onClick={() =>
                            quantity > 1 && setQuantity(quantity - 1)
                          }
                        >
                          <Minus className="size-5" />
                        </Button>

                        <span className="flex items-center justify-center w-16 h-12 border-x border-gray-4">
                          {quantity}
                        </span>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setQuantity(quantity + 1)}
                          aria-label="Aumentar cantidad"
                          className="w-12 h-12 rounded-none hover:text-blue hover:bg-transparent"
                        >
                          <Plus className="size-5" />
                        </Button>
                      </div>

                      <a
                        href="#"
                        className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
                      >
                        Purchase Now
                      </a>

                      <a
                        href="#"
                        className="flex items-center justify-center w-12 h-12 rounded-md border border-gray-3 ease-out duration-200 hover:text-white hover:bg-dark hover:border-transparent"
                      >
                        <Heart className="size-6" />
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden bg-gray-2 py-20">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
              {/* <!--== tab header start ==--> */}
              <div className="flex flex-wrap items-center bg-white rounded-[10px] shadow-1 gap-5 xl:gap-12.5 py-4.5 px-4 sm:px-6">
                {tabs.map((item, key) => (
                  <Button
                    key={key}
                    variant="ghost"
                    onClick={() => setActiveTab(item.id)}
                    className={`font-medium lg:text-lg hover:text-blue hover:bg-transparent relative before:h-0.5 before:bg-blue before:absolute before:left-0 before:bottom-0 before:ease-out before:duration-200 hover:before:w-full px-0 h-auto ${activeTab === item.id
                      ? "text-blue before:w-full"
                      : "text-dark before:w-0"
                      }`}
                  >
                    {item.title}
                  </Button>
                ))}
              </div>
              {/* <!--== tab header end ==--> */}

              {/* <!--== tab content start ==--> */}
              {/* <!-- tab content one start --> */}
              <div>
                <div
                  className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-12.5 ${activeTab === "tabOne" ? "flex" : "hidden"
                    }`}
                >
                  <div className="max-w-[670px] w-full">
                    <h2 className="font-medium text-2xl text-dark mb-7">
                      Specifications:
                    </h2>

                    <p className="mb-6">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the
                      industry&apos;s standard dummy text ever since the 1500s,
                      when an unknown printer took a galley of type and
                      scrambled it to make a type specimen book.
                    </p>
                    <p className="mb-6">
                      It has survived not only five centuries, but also the leap
                      into electronic typesetting, remaining essentially
                      unchanged. It was popularised in the 1960s.
                    </p>
                    <p>
                      with the release of Letraset sheets containing Lorem Ipsum
                      passages, and more recently with desktop publishing
                      software like Aldus PageMaker including versions.
                    </p>
                  </div>

                  <div className="max-w-[447px] w-full">
                    <h2 className="font-medium text-2xl text-dark mb-7">
                      Care & Maintenance:
                    </h2>

                    <p className="mb-6">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the
                      industry&apos;s standard dummy text ever since the 1500s,
                      when an unknown printer took a galley of type and
                      scrambled it to make a type specimen book.
                    </p>
                    <p>
                      It has survived not only five centuries, but also the leap
                      into electronic typesetting, remaining essentially
                      unchanged. It was popularised in the 1960s.
                    </p>
                  </div>
                </div>
              </div>
              {/* <!-- tab content one end --> */}

              {/* <!-- tab content two start --> */}
              <div>
                <div
                  className={`rounded-xl bg-white shadow-1 p-4 sm:p-6 mt-10 ${activeTab === "tabTwo" ? "block" : "hidden"
                    }`}
                >
                  {/* <!-- info item --> */}
                  <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                    <div className="max-w-[450px] min-w-[140px] w-full">
                      <p className="text-sm sm:text-base text-dark">Brand</p>
                    </div>
                    <div className="w-full">
                      <p className="text-sm sm:text-base text-dark">Apple</p>
                    </div>
                  </div>

                  {/* <!-- info item --> */}
                  <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                    <div className="max-w-[450px] min-w-[140px] w-full">
                      <p className="text-sm sm:text-base text-dark">Model</p>
                    </div>
                    <div className="w-full">
                      <p className="text-sm sm:text-base text-dark">
                        iPhone 14 Plus
                      </p>
                    </div>
                  </div>

                  {/* <!-- info item --> */}
                  <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                    <div className="max-w-[450px] min-w-[140px] w-full">
                      <p className="text-sm sm:text-base text-dark">
                        Display Size
                      </p>
                    </div>
                    <div className="w-full">
                      <p className="text-sm sm:text-base text-dark">
                        6.7 inches
                      </p>
                    </div>
                  </div>

                  {/* <!-- info item --> */}
                  <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                    <div className="max-w-[450px] min-w-[140px] w-full">
                      <p className="text-sm sm:text-base text-dark">
                        Display Type
                      </p>
                    </div>
                    <div className="w-full">
                      <p className="text-sm sm:text-base text-dark">
                        Super Retina XDR OLED, HDR10, Dolby Vision, 800 nits
                        (HBM), 1200 nits (peak)
                      </p>
                    </div>
                  </div>

                  {/* <!-- info item --> */}
                  <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                    <div className="max-w-[450px] min-w-[140px] w-full">
                      <p className="text-sm sm:text-base text-dark">
                        Display Resolution
                      </p>
                    </div>
                    <div className="w-full">
                      <p className="text-sm sm:text-base text-dark">
                        1284 x 2778 pixels, 19.5:9 ratio
                      </p>
                    </div>
                  </div>

                  {/* <!-- info item --> */}
                  <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                    <div className="max-w-[450px] min-w-[140px] w-full">
                      <p className="text-sm sm:text-base text-dark">Chipset</p>
                    </div>
                    <div className="w-full">
                      <p className="text-sm sm:text-base text-dark">
                        Apple A15 Bionic (5 nm)
                      </p>
                    </div>
                  </div>

                  {/* <!-- info item --> */}
                  <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                    <div className="max-w-[450px] min-w-[140px] w-full">
                      <p className="text-sm sm:text-base text-dark">Memory</p>
                    </div>
                    <div className="w-full">
                      <p className="text-sm sm:text-base text-dark">
                        128GB 6GB RAM | 256GB 6GB RAM | 512GB 6GB RAM
                      </p>
                    </div>
                  </div>

                  {/* <!-- info item --> */}
                  <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                    <div className="max-w-[450px] min-w-[140px] w-full">
                      <p className="text-sm sm:text-base text-dark">
                        Main Camera
                      </p>
                    </div>
                    <div className="w-full">
                      <p className="text-sm sm:text-base text-dark">
                        12MP + 12MP | 4K@24/25/30/60fps, stereo sound rec.
                      </p>
                    </div>
                  </div>

                  {/* <!-- info item --> */}
                  <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                    <div className="max-w-[450px] min-w-[140px] w-full">
                      <p className="text-sm sm:text-base text-dark">
                        Selfie Camera
                      </p>
                    </div>
                    <div className="w-full">
                      <p className="text-sm sm:text-base text-dark">
                        12 MP | 4K@24/25/30/60fps, 1080p@25/30/60/120fps,
                        gyro-EIS
                      </p>
                    </div>
                  </div>

                  {/* <!-- info item --> */}
                  <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                    <div className="max-w-[450px] min-w-[140px] w-full">
                      <p className="text-sm sm:text-base text-dark">
                        Battery Info
                      </p>
                    </div>
                    <div className="w-full">
                      <p className="text-sm sm:text-base text-dark">
                        Li-Ion 4323 mAh, non-removable | 15W wireless (MagSafe),
                        7.5W wireless (Qi)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- tab content two end --> */}

              {/* <!-- tab content three start --> */}
              <div>
                <div
                  className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-12.5 ${activeTab === "tabThree" ? "flex" : "hidden"
                    }`}
                >
                  <div className="max-w-[570px] w-full">
                    <h2 className="font-medium text-2xl text-dark mb-9">
                      03 Review for this product
                    </h2>

                    <div className="flex flex-col gap-6">
                      {/* <!-- review item --> */}
                      <div className="rounded-xl bg-white shadow-1 p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                          <a href="#" className="flex items-center gap-4">
                            <div className="w-12.5 h-12.5 rounded-full overflow-hidden">
                              <Image
                                src="/images/users/user-01.jpg"
                                alt="author"
                                className="w-12.5 h-12.5 rounded-full overflow-hidden"
                                width={50}
                                height={50}
                              />
                            </div>

                            <div>
                              <h3 className="font-medium text-dark">
                                Davis Dorwart
                              </h3>
                              <p className="text-custom-sm">
                                Serial Entrepreneur
                              </p>
                            </div>
                          </a>

                          <div className="flex items-center gap-1">
                            <Star className="size-[15px] fill-[#FBB040] text-[#FBB040]" />
                            <Star className="size-[15px] fill-[#FBB040] text-[#FBB040]" />
                            <Star className="size-[15px] fill-[#FBB040] text-[#FBB040]" />
                            <Star className="size-[15px] fill-[#FBB040] text-[#FBB040]" />
                            <Star className="size-[15px] fill-[#FBB040] text-[#FBB040]" />
                          </div>
                        </div>

                        <p className="text-dark mt-6">
                          “Lorem ipsum dolor sit amet, adipiscing elit. Donec
                          malesuada justo vitaeaugue suscipit beautiful
                          vehicula’’
                        </p>
                      </div>

                      {/* <!-- review item --> */}
                      <div className="rounded-xl bg-white shadow-1 p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                          <a href="#" className="flex items-center gap-4">
                            <div className="w-12.5 h-12.5 rounded-full overflow-hidden">
                              <Image
                                src="/images/users/user-01.jpg"
                                alt="author"
                                className="w-12.5 h-12.5 rounded-full overflow-hidden"
                                width={50}
                                height={50}
                              />
                            </div>

                            <div>
                              <h3 className="font-medium text-dark">
                                Davis Dorwart
                              </h3>
                              <p className="text-custom-sm">
                                Serial Entrepreneur
                              </p>
                            </div>
                          </a>

                          <div className="flex items-center gap-1">
                            <Star className="size-[15px] fill-[#FBB040] text-[#FBB040]" />

                            <Star className="size-[15px] fill-[#FBB040] text-[#FBB040]" />

                            <Star className="size-[15px] fill-[#FBB040] text-[#FBB040]" />

                            <Star className="size-[15px] fill-[#FBB040] text-[#FBB040]" />

                            <Star className="size-[15px] fill-[#FBB040] text-[#FBB040]" />
                          </div>
                        </div>

                        <p className="text-dark mt-6">
                          “Lorem ipsum dolor sit amet, adipiscing elit. Donec
                          malesuada justo vitaeaugue suscipit beautiful
                          vehicula’’
                        </p>
                      </div>

                      {/* <!-- review item --> */}
                      <div className="rounded-xl bg-white shadow-1 p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                          <a href="#" className="flex items-center gap-4">
                            <div className="w-12.5 h-12.5 rounded-full overflow-hidden">
                              <Image
                                src="/images/users/user-01.jpg"
                                alt="author"
                                className="w-12.5 h-12.5 rounded-full overflow-hidden"
                                width={50}
                                height={50}
                              />
                            </div>

                            <div>
                              <h3 className="font-medium text-dark">
                                Davis Dorwart
                              </h3>
                              <p className="text-custom-sm">
                                Serial Entrepreneur
                              </p>
                            </div>
                          </a>

                          <div className="flex items-center gap-1">
                            <Star className="size-[15px] fill-[#FBB040] text-[#FBB040]" />

                            <Star className="size-[15px] fill-[#FBB040] text-[#FBB040]" />

                            <Star className="size-[15px] fill-[#FBB040] text-[#FBB040]" />

                            <Star className="size-[15px] fill-[#FBB040] text-[#FBB040]" />

                            <Star className="size-[15px] fill-[#FBB040] text-[#FBB040]" />
                          </div>
                        </div>

                        <p className="text-dark mt-6">
                          “Lorem ipsum dolor sit amet, adipiscing elit. Donec
                          malesuada justo vitaeaugue suscipit beautiful
                          vehicula’’
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="max-w-[550px] w-full">
                    <form>
                      <h2 className="font-medium text-2xl text-dark mb-3.5">
                        Add a Review
                      </h2>

                      <p className="mb-6">
                        Your email address will not be published. Required
                        fields are marked *
                      </p>

                      <div className="flex items-center gap-3 mb-7.5">
                        <span>Your Rating*</span>

                        <div className="flex items-center gap-1">
                          <Star className="size-[15px] fill-[#FBB040] text-[#FBB040]" />

                          <Star className="size-[15px] fill-[#FBB040] text-[#FBB040]" />

                          <Star className="size-[15px] fill-[#FBB040] text-[#FBB040]" />

                          <Star className="size-[15px] cursor-pointer fill-gray-5 text-gray-5" />
                          <Star className="size-[15px] cursor-pointer fill-gray-5 text-gray-5" />
                        </div>
                      </div>

                      <div className="rounded-xl bg-white shadow-1 p-4 sm:p-6">
                        <div className="mb-5">
                          <label htmlFor="comments" className="block mb-2.5">
                            Comments
                          </label>

                          <textarea
                            name="comments"
                            id="comments"
                            rows={5}
                            placeholder="Your comments"
                            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                          />

                          <span className="flex items-center justify-between mt-2.5">
                            <span className="text-custom-sm text-dark-4">
                              Maximum
                            </span>
                            <span className="text-custom-sm text-dark-4">
                              0/250
                            </span>
                          </span>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-5 sm:gap-7.5 mb-5.5">
                          <div>
                            <label htmlFor="name" className="block mb-2.5">
                              Name
                            </label>

                            <input
                              type="text"
                              name="name"
                              id="name"
                              placeholder="Your name"
                              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                            />
                          </div>

                          <div>
                            <label htmlFor="email" className="block mb-2.5">
                              Email
                            </label>

                            <input
                              type="email"
                              name="email"
                              id="email"
                              placeholder="Your email"
                              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                            />
                          </div>
                        </div>

                        <Button type="submit">Submit Reviews</Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/* <!-- tab content three end --> */}
              {/* <!--== tab content end ==--> */}
            </div>
          </section>

          <RecentlyViewdItems />

        </>
      )}
    </>
  );
};

export default ShopDetails;
