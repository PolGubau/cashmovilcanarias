"use client";
import { Button } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { Phone, Search, ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import { menuData } from "./menuData";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const openCartSidebar = useUIStore((s) => s.openCartSidebar);
  const router = useRouter();

  const cartItems = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice)();



  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 w-full z-9999 bg-white transition-all ease-in-out duration-300 ${stickyMenu && "shadow"
        }`}
    >
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        {/* <!-- header top start --> */}
        <div
          className={`flex flex-col lg:flex-row gap-5 items-end lg:items-center xl:justify-between ease-out duration-200 ${stickyMenu ? "py-4" : "py-6"
            }`}
        >
          {/* <!-- header top left --> */}
          <div className="xl:w-auto flex-col sm:flex-row w-full flex sm:justify-between sm:items-center gap-5 sm:gap-10">
            <Link className="flex-shrink-0" href="/">
              <Image
                src="/images/logo/logo.svg"
                alt="Logo"
                width={219}
                height={36}
              />
            </Link>

            <div className="max-w-[475px] w-full">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/tienda?search=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
              >
                <div className="relative w-full">
                  <input
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                    type="search"
                    name="search"
                    id="search"
                    placeholder="Busca tu móvil..."
                    autoComplete="off"
                    className="custom-search w-full rounded-[5px] bg-gray-1 border border-gray-3 py-2.5 pl-4 pr-10 outline-none ease-in duration-200"
                  />
                  <Button
                    id="search-btn"
                    type="submit"
                    variant="ghost"
                    size="icon"
                    aria-label="Buscar"
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-full hover:text-blue"
                  >
                    <Search className="size-4.5" />
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* <!-- header top right --> */}
          <div className="flex w-full lg:w-auto items-center gap-7.5">
            <div className="hidden xl:flex items-center gap-3.5">
              <Phone className="w-6 h-6 text-blue" />

              <div>
                <span className="block text-2xs text-dark-4 uppercase">
                  SOPORTE 24/7
                </span>
                <p className="font-medium text-custom-sm text-dark">
                  +34 922 000 000
                </p>
              </div>
            </div>

            {/* <!-- divider --> */}
            <span className="hidden xl:block w-px h-7.5 bg-gray-4" />

            <div className="flex w-full lg:w-auto justify-between items-center gap-5">
              <div className="flex items-center gap-5">
                <Link href="/signin" className="flex items-center gap-2.5">
                  <User className="w-6 h-6 text-blue" />

                  <div>
                    <span className="block text-2xs text-dark-4 uppercase">
                      cuenta
                    </span>
                    <p className="font-medium text-custom-sm text-dark">
                      Iniciar sesión
                    </p>
                  </div>
                </Link>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={openCartSidebar}
                  aria-label="Ver carrito"
                  className="flex items-center gap-2.5 h-auto px-0 hover:bg-transparent"
                >
                  <span className="inline-block relative">
                    <ShoppingCart className="w-6 h-6 text-blue" />

                    <span className="flex items-center justify-center font-medium text-2xs absolute -right-2 -top-2.5 bg-blue w-4.5 h-4.5 rounded-full text-white">
                      {cartItems.length}
                    </span>
                  </span>

                  <div>
                    <span className="block text-2xs text-dark-4 uppercase">
                      carrito
                    </span>
                    <p className="font-medium text-custom-sm text-dark">
                      {formatCurrency(totalPrice)}
                    </p>
                  </div>
                </Button>
              </div>

              {/* <!-- Hamburger Toggle BTN --> */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                id="Toggle"
                aria-label="Abrir menú"
                className="xl:hidden w-auto h-auto px-0 hover:bg-transparent"
                onClick={() => setNavigationOpen(!navigationOpen)}
              >
                <span className="block relative cursor-pointer w-5.5 h-5.5">
                  <span className="du-block absolute right-0 w-full h-full">
                    <span
                      className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-[0] ${!navigationOpen && "!w-full delay-300"
                        }`}
                    />
                    <span
                      className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-150 ${!navigationOpen && "!w-full delay-400"
                        }`}
                    />
                    <span
                      className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-200 ${!navigationOpen && "!w-full delay-500"
                        }`}
                    />
                  </span>

                  <span className="block absolute right-0 w-full h-full rotate-45">
                    <span
                      className={`block bg-dark rounded-sm ease-in-out duration-200 delay-300 absolute left-2.5 top-0 w-0.5 h-full ${!navigationOpen && "!h-0 delay-[0] "
                        }`}
                    />
                    <span
                      className={`block bg-dark rounded-sm ease-in-out duration-200 delay-400 absolute left-0 top-2.5 w-full h-0.5 ${!navigationOpen && "!h-0 dealy-200"
                        }`}
                    />
                  </span>
                </span>
              </Button>
              {/* //   <!-- Hamburger Toggle BTN --> */}
            </div>
          </div>
        </div>
        {/* <!-- header top end --> */}
      </div>

      <div className="border-t border-gray-3">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
          <div className="flex items-center justify-between">
            {/* <!--=== Main Nav Start ===--> */}
            <div
              className={`w-[288px] absolute right-4 top-full xl:static xl:w-auto h-0 xl:h-auto invisible xl:visible xl:flex items-center justify-between ${navigationOpen &&
                `!visible bg-white shadow-lg border border-gray-3 !h-auto max-h-[400px] overflow-y-scroll rounded-md p-5`
                }`}
            >
              {/* <!-- Main Nav Start --> */}
              <nav>
                <ul className="flex xl:items-center flex-col xl:flex-row gap-5 xl:gap-6">
                  {menuData.map((menuItem, i) =>
                    menuItem.submenu ? (
                      <Dropdown
                        key={i}
                        menuItem={menuItem}
                        stickyMenu={stickyMenu}
                      />
                    ) : (
                      <li
                        key={i}
                        className="group relative before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full "
                      >
                        <Link
                          href={menuItem.path}
                          className={`hover:text-blue text-custom-sm font-medium text-dark flex ${stickyMenu ? "xl:py-4" : "xl:py-6"
                            }`}
                        >
                          {menuItem.title}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </nav>
              {/* //   <!-- Main Nav End --> */}
            </div>
            {/* // <!--=== Main Nav End ===--> */}

            {/* <!--=== Nav Right: contact link ===--> */}
            <div className="hidden xl:block">
              <ul className="flex items-center gap-5.5">
                <li className="py-4">
                  <Link
                    href="/contact"
                    className="font-medium text-custom-sm text-dark hover:text-blue"
                  >
                    ¿Necesitas ayuda?
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
