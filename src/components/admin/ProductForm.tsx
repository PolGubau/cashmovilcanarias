"use client";

import ImageUploader from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  createProduct,
  createVariant,
  deleteVariant,
  updateProduct,
  updateVariant,
} from "@/lib/actions/products";
import {
  PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
  type ProductCondition,
  type ProductImage,
  type ProductVariant,
} from "@/lib/supabase/types";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const selectCls = "w-full h-9 border border-gray-3 rounded-lg px-3 text-sm text-dark bg-white focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue";

const CONDITIONS = ["new", "like_new"] as const;
const CONDITION_LABELS: Record<string, string> = {
  new: "Nuevo",
  like_new: "Seminuevo",
};
const CATEGORY_OPTIONS = Object.entries(PRODUCT_CATEGORIES) as [
  ProductCategory,
  string,
][];

type VariantRow = {
  id?: string; // undefined = new (not yet persisted)
  capacity: string;
  color: string;
  condition: string;
  battery_health: string;
  stock: string;
  price: string;
  purchase_price: string;
};
const emptyVariant = (): VariantRow => ({
  capacity: "",
  color: "",
  condition: "new",
  battery_health: "",
  stock: "1",
  price: "",
  purchase_price: "",
});

function variantToRow(v: ProductVariant): VariantRow {
  return {
    id: v.id,
    capacity: v.capacity ?? "",
    color: v.color ?? "",
    condition: v.condition ?? "new",
    battery_health: v.battery_health?.toString() ?? "",
    stock: v.stock.toString(),
    price: v.price.toString(),
    purchase_price: v.purchase_price?.toString() ?? "",
  };
}

interface ProductFormProps {
  initialProduct?: Product;
  initialVariants?: ProductVariant[];
  initialImages?: ProductImage[];
}

export default function ProductForm({
  initialProduct,
  initialVariants,
  initialImages = [],
}: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialProduct;
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [variants, setVariants] = useState<VariantRow[]>(
    initialVariants?.length ? initialVariants.map(variantToRow) : [emptyVariant()],
  );
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  // Derived: the product id available for images (either editing or just created)
  const imageProductId = initialProduct?.id ?? createdProductId;

  const updateVariantRow = (i: number, key: keyof VariantRow, val: string) =>
    setVariants((prev) =>
      prev.map((v, idx) => (idx === i ? { ...v, [key]: val } : v)),
    );

  function removeVariant(i: number) {
    const row = variants[i];
    if (row.id) setDeletedIds((prev) => [...prev, row.id!]);
    setVariants((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const productData = {
      name: fd.get("name") as string,
      brand: fd.get("brand") as string,
      base_model: fd.get("base_model") as string,
      category: (fd.get("category") as ProductCategory) || null,
      description: (fd.get("description") as string) || null,
      warranty_months: Number(fd.get("warranty_months") || 6),
    };

    try {
      if (isEditing) {
        await updateProduct(initialProduct.id, productData);

        // Delete removed variants
        await Promise.all(deletedIds.map((vid) => deleteVariant(vid, initialProduct.id)));

        // Upsert variants
        await Promise.all(
          variants
            .filter((v) => v.price)
            .map((v) => {
              const payload = {
                product_id: initialProduct.id,
                capacity: v.capacity || null,
                color: v.color || null,
                condition: (v.condition as ProductCondition) || null,
                battery_health: v.battery_health ? Number(v.battery_health) : null,
                stock: Number(v.stock || 0),
                price: Number(v.price),
                purchase_price: v.purchase_price ? Number(v.purchase_price) : null,
                sku: null,
                is_active: true,
              };
              return v.id
                ? updateVariant(v.id, payload, initialProduct.id)
                : createVariant(payload);
            }),
        );

        toast.success("Producto actualizado");
        router.refresh();
      } else {
        const prod = await createProduct(
          { ...productData, is_published: false },
          variants
            .filter((v) => v.price)
            .map((v) => ({
              product_id: "",
              capacity: v.capacity || null,
              color: v.color || null,
              condition: (v.condition as ProductCondition) || null,
              battery_health: v.battery_health ? Number(v.battery_health) : null,
              stock: Number(v.stock || 0),
              price: Number(v.price),
              purchase_price: v.purchase_price ? Number(v.purchase_price) : null,
              sku: null,
              is_active: true,
            })),
        );
        setCreatedProductId(prod.id);
        toast.success("Producto creado. Añade imágenes o guarda y continúa.");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del producto</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="name" required>
              Nombre
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="iPhone 13 Pro 128GB Negro"
              required
              defaultValue={initialProduct?.name}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="brand" required>
              Marca
            </Label>
            <Input
              id="brand"
              name="brand"
              placeholder="Apple"
              required
              defaultValue={initialProduct?.brand}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="base_model" required>
              Modelo base
            </Label>
            <Input
              id="base_model"
              name="base_model"
              placeholder="iPhone 13 Pro"
              required
              defaultValue={initialProduct?.base_model}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="warranty_months">Garantía (meses)</Label>
            <Input
              id="warranty_months"
              name="warranty_months"
              type="number"
              defaultValue={initialProduct?.warranty_months ?? 6}
              min="0"
              max="36"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="category">Categoría</Label>
            <select
              id="category"
              name="category"
              defaultValue={initialProduct?.category ?? ""}
              className={`mt-1.5 ${selectCls}`}
            >
              <option value="">Sin categoría</option>
              {CATEGORY_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descripción del producto..."
              rows={3}
              defaultValue={initialProduct?.description ?? ""}
              className="mt-1.5"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Variantes</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => setVariants((p) => [...p, emptyVariant()])}
            >
              Añadir variante
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {variants.map((v, i) => (
            <div
              key={i}
              className="grid grid-cols-4 gap-3 p-4 bg-gray-1 rounded-lg border border-gray-3 relative"
            >
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="absolute top-3 right-3 text-dark-4 hover:text-red transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <div>
                <Label>Capacidad</Label>
                <Input
                  value={v.capacity}
                  onChange={(e) => updateVariantRow(i, "capacity", e.target.value)}
                  placeholder="128GB"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Color</Label>
                <Input
                  value={v.color}
                  onChange={(e) => updateVariantRow(i, "color", e.target.value)}
                  placeholder="Negro"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Estado</Label>
                <select
                  value={v.condition}
                  onChange={(e) => updateVariantRow(i, "condition", e.target.value)}
                  className={`mt-1 ${selectCls}`}
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {CONDITION_LABELS[c]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Batería %</Label>
                <Input
                  type="number"
                  value={v.battery_health}
                  onChange={(e) => updateVariantRow(i, "battery_health", e.target.value)}
                  placeholder="85"
                  min="0"
                  max="100"
                  className="mt-1"
                />
              </div>
              <div>
                <Label required>Precio venta €</Label>
                <Input
                  type="number"
                  value={v.price}
                  onChange={(e) => updateVariantRow(i, "price", e.target.value)}
                  placeholder="299"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Precio compra €</Label>
                <Input
                  type="number"
                  value={v.purchase_price}
                  onChange={(e) => updateVariantRow(i, "purchase_price", e.target.value)}
                  placeholder="200"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={v.stock}
                  onChange={(e) => updateVariantRow(i, "stock", e.target.value)}
                  min="0"
                  className="mt-1"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Images — available once the product has an id (editing or just created) */}
      {imageProductId && (
        <Card>
          <CardHeader>
            <CardTitle>Imágenes</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploader
              productId={imageProductId}
              initialImages={initialImages}
            />
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        {!createdProductId && (
          <Button type="submit" loading={loading}>
            {isEditing ? "Guardar cambios" : "Crear producto"}
          </Button>
        )}
        {createdProductId && (
          <Button
            type="button"
            loading={navigating}
            onClick={() => {
              setNavigating(true);
              router.push(`/admin/products/${createdProductId}`);
            }}
          >
            Ir al producto
          </Button>
        )}
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {createdProductId ? "Volver al listado" : "Cancelar"}
        </Button>
      </div>
    </form>
  );
}
