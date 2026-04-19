"use client";
import { Button } from "@/components/ui/button";
import type { ProductImage } from "@/lib/supabase/types";
import { Package } from "lucide-react";
import { useState } from "react";

interface Props {
  images: Pick<ProductImage, "id" | "url" | "alt">[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: Props) {
  const [activeUrl, setActiveUrl] = useState<string | undefined>(images[0]?.url);

  return (
    <div>
      {/* Main image */}
      <div className="aspect-square bg-gray-1 rounded-2xl overflow-hidden border border-gray-3">
        {activeUrl ? (
          <img
            src={activeUrl}
            alt={productName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Package className="h-20 w-20 text-gray-4" />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img) => (
            <Button
              key={img.id}
              type="button"
              variant="ghost"
              onClick={() => setActiveUrl(img.url)}
              aria-label={img.alt ?? productName}
              className={`flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-colors p-0 ${activeUrl === img.url ? "border-blue" : "border-gray-3 hover:border-gray-4"
                }`}
            >
              <img
                src={img.url}
                alt={img.alt ?? productName}
                className="h-full w-full object-cover"
              />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
