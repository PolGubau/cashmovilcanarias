"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import EditOrder from "./EditOrder";
import OrderDetails from "./OrderDetails";
import type { OrderItem } from "./ordersData";

interface OrderModalProps {
  showDetails: boolean;
  showEdit: boolean;
  toggleModal: (status: boolean) => void;
  order: OrderItem;
}

const OrderModal = ({
  showDetails,
  showEdit,
  toggleModal,
  order,
}: OrderModalProps) => {
  if (!showDetails && !showEdit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/50">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2 mx-4">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => toggleModal(false)}
          className="absolute top-4 right-4 text-dark-4 hover:text-dark w-8 h-8"
          aria-label="Cerrar"
        >
          ✕
        </Button>

        {showDetails && !showEdit && (
          <div className="p-6">
            <h3 className="font-semibold text-dark text-lg mb-4">
              Detalles del pedido
            </h3>
            <OrderDetails orderItem={order} />
          </div>
        )}

        {showEdit && (
          <div className="p-6">
            <h3 className="font-semibold text-dark text-lg mb-4">
              Editar pedido
            </h3>
            <EditOrder order={order} toggleModal={toggleModal} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderModal;
