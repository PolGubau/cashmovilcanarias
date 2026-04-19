import EmptyCartIcon from "@/components/icons/EmptyCartIcon";
import { useUIStore } from "@/store/ui.store";
import Link from "next/link";

const EmptyCart = () => {
  const closeCartSidebar = useUIStore((s) => s.closeCartSidebar);

  return (
    <div className="text-center">
      <div className="mx-auto pb-7.5">
        <EmptyCartIcon />
      </div>

      <p className="pb-6">¡Tu carrito está vacío!</p>

      <Link
        onClick={() => closeCartSidebar()}
        href="/tienda"
        className="w-full lg:w-10/12 mx-auto flex justify-center font-medium text-white bg-dark py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-opacity-95"
      >
        Seguir comprando
      </Link>
    </div>
  );
};

export default EmptyCart;
