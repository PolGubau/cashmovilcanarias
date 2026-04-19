import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import React from "react";

interface OrderActionsProps {
  toggleEdit: () => void;
  toggleDetails: () => void;
}

const OrderActions = ({ toggleEdit, toggleDetails }: OrderActionsProps) => {
  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        onClick={toggleDetails}
        aria-label="Ver detalles"
        className="w-8 h-8 rounded-sm hover:bg-gray-2"
      >
        <Eye className="size-[18px]" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={toggleEdit}
        aria-label="Editar"
        className="w-8 h-8 rounded-sm hover:bg-gray-2"
      >
        <Pencil className="size-[18px]" />
      </Button>
    </>
  );
};

export default OrderActions;
