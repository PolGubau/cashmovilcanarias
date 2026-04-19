"use client";

import { Modal, ModalContent } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React from "react";

const AddressModal = ({ isOpen, closeModal }) => {
  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
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
          onClick={closeModal}
          aria-label="Cerrar modal"
          className="absolute top-0 right-0 sm:top-3 sm:right-3 w-10 h-10 rounded-full bg-meta text-body hover:text-dark hover:bg-meta/80"
        >
          <X className="size-[26px]" />
        </Button>

        <div>
          <form>
            <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
              <div className="w-full">
                <label htmlFor="name" className="block mb-2.5">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value="James Septimus"
                  className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>

              <div className="w-full">
                <label htmlFor="email" className="block mb-2.5">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value="jamse@example.com"
                  className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
              <div className="w-full">
                <label htmlFor="phone" className="block mb-2.5">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value="1234 567890"
                  className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>

              <div className="w-full">
                <label htmlFor="address" className="block mb-2.5">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value="7398 Smoke Ranch RoadLas Vegas, Nevada 89128"
                  className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>
            </div>

            <Button type="submit">Save Changes</Button>
          </form>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default AddressModal;
