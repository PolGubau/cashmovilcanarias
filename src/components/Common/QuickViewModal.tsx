"use client";

import { Button, Modal, ModalContent, QuantityStepper } from "@/components/ui";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { CheckCircle2, Heart, Star, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const QuickViewModal = () => {
  const { isQuickViewOpen, quickViewProduct, closeQuickView } = useUIStore();
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      id: quickViewProduct.id,
      name: quickViewProduct.name,
      brand: quickViewProduct.brand,
      price: quickViewProduct.price_from ?? 0,
      primary_image_url: quickViewProduct.primary_image_url,
      quantity,
    });

    closeQuickView();
    setQuantity(1);
  };

  return (
    <Modal
      open={isQuickViewOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeQuickView();
          setQuantity(1);
        }
      }}
    >
      <ModalContent
        size="xl"
        showCloseButton={false}
        className="w-full max-w-[1100px] p-7.5"
      >
        <Button
          size="icon"
          variant="ghost"
          onClick={() => { closeQuickView(); setQuantity(1); }}
          aria-label="Cerrar"
          className="absolute top-0 right-0 sm:top-6 sm:right-6 rounded-full bg-meta text-body hover:text-dark hover:bg-meta/80"
        >
          <X className="size-6" />
        </Button>

        <div className="flex flex-wrap items-center gap-12.5">
          <div className="max-w-[526px] w-full">
            <div className="flex gap-5">
              <div className="relative z-1 overflow-hidden flex items-center justify-center w-full sm:min-h-[508px] bg-gray-1 rounded-lg border border-gray-3">
                {quickViewProduct.primary_image_url && (
                  <Image
                    src={quickViewProduct.primary_image_url}
                    alt={quickViewProduct.name}
                    width={400}
                    height={400}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="max-w-[445px] w-full">
            <span className="inline-block text-custom-xs font-medium text-white py-1 px-3 bg-green mb-6.5">
              SALE 20% OFF
            </span>

            <h3 className="font-semibold text-xl xl:text-heading-5 text-dark mb-4">
              {quickViewProduct.name}
            </h3>

            <div className="flex flex-wrap items-center gap-5 mb-6">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1">
                  <Star className="size-[18px] fill-[#FFA645] text-[#FFA645]" />
                  <Star className="size-[18px] fill-[#FFA645] text-[#FFA645]" />
                  <Star className="size-[18px] fill-[#FFA645] text-[#FFA645]" />
                  <Star className="size-[18px] fill-gray-4 text-gray-4" />
                  <Star className="size-[18px] fill-gray-4 text-gray-4" />
                </div>

                <span>
                  <span className="font-medium text-dark"> 4.7 Rating </span>
                  <span className="text-dark-2"> (5 reviews) </span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-[#22AD5C]" />
                <span className="font-medium text-dark"> En stock </span>
              </div>
            </div>

            <p>{quickViewProduct.description ?? ""}</p>

            <div className="flex flex-wrap justify-between gap-5 mt-6 mb-7.5">
              <div>
                <h4 className="font-semibold text-lg text-dark mb-3.5">
                  Precio
                </h4>

                <span className="flex items-center gap-2">
                  <span className="font-semibold text-dark text-xl xl:text-heading-4">
                    ${quickViewProduct.price_from ?? 0}
                  </span>
                </span>
              </div>

              <div>
                <h4 className="font-semibold text-lg text-dark mb-3.5">
                  Cantidad
                </h4>
                <QuantityStepper
                  value={quantity}
                  onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                  onIncrease={() => setQuantity((q) => q + 1)}
                  variant="separated"
                  size="md"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                type="button"
                disabled={quantity === 0}
                onClick={handleAddToCart}
              >
                Añadir al carrito
              </Button>

              <Button
                type="button"
                variant="secondary"
                leftIcon={<Heart className="w-5 h-5" />}
                className="bg-dark text-white border-dark hover:bg-dark/90"
              >
                Añadir a favoritos
              </Button>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default QuickViewModal;
