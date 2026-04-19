"use client";

import { Modal, ModalContent } from "@/components/ui";
import { Button } from "@/components/ui/button";
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
          <svg
            className="fill-current"
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z"
              fill=""
            />
          </svg>
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
