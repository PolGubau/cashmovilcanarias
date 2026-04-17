import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  /** Puntuación de 0 a 5 (admite decimales) */
  rating?: number;
  /** Número total de estrellas a mostrar */
  total?: number;
  /** Texto secundario junto a las estrellas (ej: "12 reseñas" o "3 variantes") */
  label?: string;
  /** Tamaño en px de cada estrella */
  size?: number;
  className?: string;
}

const StarRating = ({
  rating = 5,
  total = 5,
  label,
  size = 14,
  className,
}: StarRatingProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-0.5" aria-label={`${rating} de ${total} estrellas`}>
        {Array.from({ length: total }, (_, i) => {
          const filled = i < Math.floor(rating);
          const partial = !filled && i < rating;

          return (
            <span key={i} className="relative inline-flex">
              {/* estrella base (vacía) */}
              <Star
                style={{ width: size, height: size }}
                className="text-gray-3 fill-gray-3"
                strokeWidth={0}
              />
              {/* relleno (total o parcial) */}
              {(filled || partial) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: partial ? `${(rating % 1) * 100}%` : "100%" }}
                >
                  <Star
                    style={{ width: size, height: size }}
                    className="text-yellow fill-yellow"
                    strokeWidth={0}
                  />
                </span>
              )}
            </span>
          );
        })}
      </div>

      {label && (
        <span className="text-custom-sm text-dark-4">{label}</span>
      )}
    </div>
  );
};

export { StarRating };
export type { StarRatingProps };
