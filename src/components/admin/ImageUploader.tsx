"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import {
  deleteProductImage,
  importImageFromUrl,
  setPrimaryImage,
  uploadProductImage,
} from "@/lib/actions/products";
import type { ProductImage } from "@/lib/supabase/types";
import { ImagePlus, Link2, Loader2, Star, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ImageUploader({
  productId,
  initialImages,
}: {
  productId: string;
  initialImages: ProductImage[];
}) {
  const [images, setImages] = useState<ProductImage[]>(initialImages);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [urlInput, setUrlInput] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isUploading = uploadingCount > 0;

  const doUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return toast.error("Solo imágenes");
      setUploadingCount((c) => c + 1);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const img = await uploadProductImage(productId, fd);
        setImages((p) => [...p, img]);
        toast.success("Imagen añadida");
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Error al subir imagen");
      } finally {
        setUploadingCount((c) => c - 1);
      }
    },
    [productId],
  );

  const doImportUrl = useCallback(
    async (url: string) => {
      setUploadingCount((c) => c + 1);
      try {
        const img = await importImageFromUrl(productId, url);
        setImages((p) => [...p, img]);
        setUrlInput("");
        toast.success("Imagen importada");
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Error al importar imagen");
      } finally {
        setUploadingCount((c) => c - 1);
      }
    },
    [productId],
  );

  const handleFiles = (files: FileList | File[]) =>
    Array.from(files).forEach(doUpload);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  // Global paste: works regardless of which element has focus
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      // Let normal inputs handle their own paste
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      const items = Array.from(e.clipboardData?.items ?? []);

      // Image data (screenshot, copied image)
      const imageItem = items.find((it) => it.type.startsWith("image/"));
      if (imageItem) {
        const f = imageItem.getAsFile();
        if (f) { doUpload(f); return; }
      }

      // Text that looks like a URL → auto-populate input + import if direct image
      const textItem = items.find((it) => it.type === "text/plain");
      if (textItem) {
        textItem.getAsString((text) => {
          const trimmed = text.trim();
          if (!trimmed.startsWith("http")) return;
          setUrlInput(trimmed);
          if (/\.(jpe?g|png|webp|gif|avif)(\?.*)?$/i.test(trimmed)) {
            doImportUrl(trimmed);
          }
        });
      }
    };

    window.addEventListener("paste", handleGlobalPaste);
    return () => window.removeEventListener("paste", handleGlobalPaste);
  }, [doUpload, doImportUrl]);

  const handleDelete = async (img: ProductImage) => {
    try {
      await deleteProductImage(img.id, productId);
      setImages((prev) => {
        const next = prev.filter((i) => i.id !== img.id);
        if (img.is_primary && next.length > 0)
          next[0] = { ...next[0], is_primary: true };
        return next;
      });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al eliminar");
    }
  };

  const handleSetPrimary = async (img: ProductImage) => {
    try {
      await setPrimaryImage(img.id, productId);
      setImages((prev) =>
        prev.map((i) => ({ ...i, is_primary: i.id === img.id })),
      );
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error");
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop zone: drag, click, paste */}
      <button
        type="button"
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`w-full flex flex-col items-center justify-center gap-2 h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all select-none ${dragging
          ? "border-blue bg-blue/5 scale-[1.01]"
          : "border-gray-3 hover:border-blue/50 hover:bg-gray-1"
          }`}
      >
        {isUploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-blue" />
        ) : (
          <>
            <ImagePlus className="h-5 w-5 text-dark-4" />
            <p className="text-xs text-dark-4 text-center">
              Arrastra, pega{" "}
              <kbd className="px-1 bg-gray-2 rounded text-[10px]">Ctrl+V</kbd>{" "}
              en cualquier lugar, o haz clic para seleccionar
            </p>
          </>
        )}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {/* URL import — Amazon, Xataka, direct image URL */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dark-4" />
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                doImportUrl(urlInput.trim());
              }
            }}
            placeholder="URL de imagen directa (jpg, png, webp…)"
            className="pl-8 text-sm"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={isUploading}
          onClick={() => doImportUrl(urlInput.trim())}
          disabled={!urlInput.trim() || isUploading}
        >
          Importar
        </Button>
      </div>

      {/* Existing images grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group rounded-lg overflow-hidden border border-gray-3 aspect-square bg-gray-1"
            >
              <img
                src={img.url}
                alt={img.alt ?? ""}
                className="w-full h-full object-cover"
              />
              {img.is_primary && (
                <div className="absolute top-1.5 left-1.5 bg-yellow/90 text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Star className="h-2.5 w-2.5" />
                  Principal
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.is_primary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(img)}
                    className="p-1.5 bg-white rounded-lg hover:bg-yellow/10 transition-colors"
                    title="Establecer como principal"
                  >
                    <Star className="h-3.5 w-3.5 text-yellow-600" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(img)}
                  className="p-1.5 bg-white rounded-lg hover:bg-red/10 transition-colors"
                  title="Eliminar imagen"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
