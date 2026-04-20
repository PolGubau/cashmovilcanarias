"use client";

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/lib/actions/products";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteProduct(productId);
      setOpen(false);
      router.push("/admin/products");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" leftIcon={<Trash2 className="h-4 w-4" />}>
          Eliminar producto
        </Button>
      </DialogTrigger>

      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>¿Eliminar este producto?</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm text-dark-4">
            Se eliminarán también todas sus variantes e imágenes. Esta acción{" "}
            <strong className="text-dark">no se puede deshacer</strong>.
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm" disabled={isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? "Eliminando…" : "Sí, eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
