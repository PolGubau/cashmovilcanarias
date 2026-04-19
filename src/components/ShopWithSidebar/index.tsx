"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, ChevronLeft, ChevronRight, LayoutGrid, LayoutList } from "lucide-react";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import shopData from "../Shop/shopData";
import CategoryDropdown from "./CategoryDropdown";
import ColorsDropdwon from "./ColorsDropdwon";
import CustomSelect from "./CustomSelect";
import GenderDropdown from "./GenderDropdown";
import PriceDropdown from "./PriceDropdown";
import SizeDropdown from "./SizeDropdown";

const ShopWithSidebar = () => {
  const [productStyle, setProductStyle] = useState("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  const options = [
    { label: "Latest Products", value: "0" },
    { label: "Best Selling", value: "1" },
    { label: "Old Products", value: "2" },
  ];

  const categories = [
    {
      name: "Smartphones",
      products: 42,
      isRefined: true,
    },
    {
      name: "iPhone",
      products: 18,
      isRefined: false,
    },
    {
      name: "Samsung",
      products: 15,
      isRefined: false,
    },
    {
      name: "Xiaomi",
      products: 9,
      isRefined: false,
    },
    {
      name: "Tablets",
      products: 14,
      isRefined: false,
    },
    {
      name: "iPad",
      products: 8,
      isRefined: false,
    },
  ];

  const genders = [
    {
      name: "Nuevo",
      products: 12,
    },
    {
      name: "Excelente",
      products: 28,
    },
    {
      name: "Bueno",
      products: 16,
    },
  ];

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);

    // closing sidebar while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".sidebar-content")) {
        setProductSidebar(false);
      }
    }

    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <>
      <Breadcrumb
        title={"Explore All Products"}
        pages={["shop", "/", "shop with sidebar"]}
      />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* <!-- Sidebar Start --> */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${productSidebar
                ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
                : "-translate-x-full"
                }`}
            >
              <Button
                size="icon"
                variant="outline"
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="Abrir/cerrar filtros"
                className={`xl:hidden absolute -right-12.5 sm:-right-8 w-8 h-8 rounded-md bg-white border-0 shadow-1 ${stickyMenu
                  ? "lg:top-20 sm:top-34.5 top-35"
                  : "lg:top-24 sm:top-39 top-37"
                  }`}
              >
                <ArrowLeftRight className="size-6" />
              </Button>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                  {/* <!-- filter box --> */}
                  <div className="bg-white shadow-1 rounded-lg py-4 px-5">
                    <div className="flex items-center justify-between">
                      <p>Filters:</p>
                      <Button variant="ghost" className="text-blue hover:text-blue-dark px-0">Limpiar filtros</Button>
                    </div>
                  </div>

                  {/* <!-- category box --> */}
                  <CategoryDropdown categories={categories} />

                  {/* <!-- gender box --> */}
                  <GenderDropdown genders={genders} />

                  {/* // <!-- size box --> */}
                  <SizeDropdown />

                  {/* // <!-- color box --> */}
                  <ColorsDropdwon />

                  {/* // <!-- price range box --> */}
                  <PriceDropdown />
                </div>
              </form>
            </div>
            {/* // <!-- Sidebar End --> */}

            {/* // <!-- Content Start --> */}
            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex items-center justify-between">
                  {/* <!-- top bar left --> */}
                  <div className="flex flex-wrap items-center gap-4">
                    <CustomSelect options={options} />

                    <p>
                      Showing <span className="text-dark">9 of 50</span>{" "}
                      Products
                    </p>
                  </div>

                  {/* <!-- top bar right --> */}
                  <div className="flex items-center gap-2.5">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setProductStyle("grid")}
                      aria-label="Vista en cuadrícula"
                      className={`w-10.5 h-9 rounded-[5px] ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white ${productStyle === "grid"
                        ? "bg-blue border-blue text-white"
                        : "text-dark bg-gray-1 border-gray-3"
                        }`}
                    >
                      <LayoutGrid className="size-[18px]" />
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setProductStyle("list")}
                      aria-label="Vista en lista"
                      className={`w-10.5 h-9 rounded-[5px] ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white ${productStyle === "list"
                        ? "bg-blue border-blue text-white"
                        : "text-dark bg-gray-1 border-gray-3"
                        }`}
                    >
                      <LayoutList className="size-[18px]" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* <!-- Products Grid Tab Content Start --> */}
              <div
                className={`${productStyle === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9"
                  : "flex flex-col gap-7.5"
                  }`}
              >
                {shopData.map((item, key) =>
                  productStyle === "grid" ? (
                    <SingleGridItem item={item} key={key} />
                  ) : (
                    <SingleListItem item={item} key={key} />
                  )
                )}
              </div>
              {/* <!-- Products Grid Tab Content End --> */}

              {/* <!-- Products Pagination Start --> */}
              <div className="flex justify-center mt-15">
                <div className="bg-white shadow-1 rounded-md p-2">
                  <ul className="flex items-center">
                    <li>
                      <Button
                        size="icon"
                        variant="ghost"
                        type="button"
                        disabled
                        aria-label="Página anterior"
                        className="w-8 h-9 rounded-[3px] disabled:text-gray-4 hover:bg-blue hover:text-white"
                      >
                        <ChevronLeft className="size-[18px]" />
                      </Button>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 duration-200 rounded-[3px] bg-blue text-white hover:text-white hover:bg-blue"
                      >
                        1
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 duration-200 rounded-[3px] hover:text-white hover:bg-blue"
                      >
                        2
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 duration-200 rounded-[3px] hover:text-white hover:bg-blue"
                      >
                        3
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 duration-200 rounded-[3px] hover:text-white hover:bg-blue"
                      >
                        4
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 duration-200 rounded-[3px] hover:text-white hover:bg-blue"
                      >
                        5
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 duration-200 rounded-[3px] hover:text-white hover:bg-blue"
                      >
                        ...
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 duration-200 rounded-[3px] hover:text-white hover:bg-blue"
                      >
                        10
                      </a>
                    </li>

                    <li>
                      <Button
                        size="icon"
                        variant="ghost"
                        type="button"
                        aria-label="Página siguiente"
                        className="w-8 h-9 rounded-[3px] hover:bg-blue hover:text-white"
                      >
                        <ChevronRight className="size-[18px]" />
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
              {/* <!-- Products Pagination End --> */}
            </div>
            {/* // <!-- Content End --> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;
