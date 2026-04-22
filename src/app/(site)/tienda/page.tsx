import {
  getPublishedProductBrands,
  getPublishedProducts,
} from "@/lib/actions/products";
import { STORE_PAGE_SIZE } from "@/lib/actions/products.constants";
import type { ProductWithRelations } from "@/lib/actions/products.constants";
import { PRODUCT_CATEGORIES, type ProductCategory } from "@/lib/supabase/types";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Package, ShoppingBag, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tienda | CashMóvil Canarias",
  description: "Móviles reacondicionados con garantía — iPhone, Samsung, Xiaomi y más.",
};

const CONDITION_LABEL: Record<string, string> = {
  new: "Nuevo",
  like_new: "Seminuevo",
};

const CONDITIONS = Object.entries(CONDITION_LABEL);

const CATEGORY_GROUPS: { label: string; items: ProductCategory[] }[] = [
  {
    label: "Dispositivos",
    items: ["smartphone", "tablet", "smartwatch", "auriculares"],
  },
  {
    label: "Accesorios",
    items: [
      "fundas_protectores",
      "cargadores_cables",
      "power_bank",
      "gadgets",
      "accesorios_ordenador",
      "movilidad",
      "bolsos_mochilas",
      "guess",
    ],
  },
];

/** Returns page numbers and "…" ellipsis items for the pagination nav. */
function buildPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; category?: string; condition?: string; search?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const currentPage = Math.max(1, Number(sp.page ?? 1));

  const [{ products, total }, brands] = await Promise.all([
    getPublishedProducts({
      brand: sp.brand,
      category: sp.category as ProductCategory | undefined,
      condition: sp.condition,
      search: sp.search,
      page: currentPage,
    }).catch(() => ({ products: [] as ProductWithRelations[], total: 0 })),
    getPublishedProductBrands(sp.search).catch(() => [] as string[]),
  ]);

  const totalPages = Math.ceil(total / STORE_PAGE_SIZE);
  const from = (currentPage - 1) * STORE_PAGE_SIZE + 1;
  const to = Math.min(currentPage * STORE_PAGE_SIZE, total);

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { brand: sp.brand, category: sp.category, condition: sp.condition, search: sp.search, page: String(currentPage), ...overrides };
    for (const [k, v] of Object.entries(merged)) if (v && !(k === "page" && v === "1")) params.set(k, v);
    const qs = params.toString();
    return `/tienda${qs ? `?${qs}` : ""}`;
  };

  const chip = (active: boolean) =>
    `px-3.5 py-1.5 rounded-full text-sm border transition-colors whitespace-nowrap ${active
      ? "bg-dark text-white border-dark"
      : "bg-white text-dark-3 border-gray-3 hover:border-dark hover:text-dark"
    }`;

  const hasFilters = !!(sp.brand || sp.category || sp.condition);

  const activeFilters = [
    sp.category && { label: PRODUCT_CATEGORIES[sp.category as ProductCategory] ?? sp.category, clear: buildUrl({ category: undefined, page: "1" }) },
    sp.condition && { label: CONDITION_LABEL[sp.condition] ?? sp.condition, clear: buildUrl({ condition: undefined, page: "1" }) },
    sp.brand && { label: sp.brand, clear: buildUrl({ brand: undefined, page: "1" }) },
  ].filter(Boolean) as { label: string; clear: string }[];

  return (
    <section className="container pb-20 pt-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark">Móviles reacondicionados</h1>
        <p className="text-dark-4 mt-1">
          {sp.search ? `Resultados para "${sp.search}"` : "Dispositivos verificados con garantía"}
        </p>
      </div>

      {/* ── Filters ────────────────────────────────────────────────── */}
      <div className="mb-8 space-y-4 rounded-xl border border-gray-3 bg-white p-4">

        {/* Category — collapsible groups */}
        <div>
          <div className="mb-3 flex items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-dark-4 shrink-0">Categoría</p>
            <Link href={buildUrl({ category: undefined })} className={chip(!sp.category)}>
              Todas
            </Link>
          </div>
          <div className="divide-y divide-gray-3">
            {CATEGORY_GROUPS.map((group) => {
              const isGroupActive = group.items.includes(sp.category as ProductCategory);
              const defaultOpen = group.label === "Dispositivos" || isGroupActive;
              return (
                <details key={group.label} open={defaultOpen} className="group/cat">
                  <summary className="flex cursor-pointer list-none select-none items-center justify-between py-2.5 text-[11px] font-semibold uppercase tracking-wider text-dark-3">
                    <span>{group.label}</span>
                    <ChevronRight className="size-3.5 text-dark-4 transition-transform duration-200 group-open/cat:rotate-90" />
                  </summary>
                  <div className="flex flex-wrap gap-2 pb-3">
                    {group.items.map((val) => (
                      <Link key={val} href={buildUrl({ category: val })} className={chip(sp.category === val)}>
                        {PRODUCT_CATEGORIES[val]}
                      </Link>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </div>

        {/* Estado + Marca — secondary, side by side */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-dark-4">Estado</p>
            <div className="flex flex-wrap gap-2">
              <Link href={buildUrl({ condition: undefined })} className={chip(!sp.condition)}>Cualquiera</Link>
              {CONDITIONS.map(([val, label]) => (
                <Link key={val} href={buildUrl({ condition: val })} className={chip(sp.condition === val)}>{label}</Link>
              ))}
            </div>
          </div>

          {brands.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-dark-4">Marca</p>
              <div className="flex flex-wrap gap-2">
                <Link href={buildUrl({ brand: undefined })} className={chip(!sp.brand)}>Todas</Link>
                {brands.map((brand) => (
                  <Link key={brand} href={buildUrl({ brand })} className={chip(sp.brand === brand)}>{brand}</Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active filters summary */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 border-t border-gray-3 pt-3">
            <span className="text-xs text-dark-4">Filtros activos:</span>
            {activeFilters.map((f) => (
              <Link
                key={f.label}
                href={f.clear}
                className="inline-flex items-center gap-1 rounded-full bg-dark px-3 py-1 text-xs font-medium text-white hover:bg-dark-3 transition-colors"
              >
                {f.label}
                <X className="size-3" />
              </Link>
            ))}
            <Link
              href="/tienda"
              className="ml-auto text-xs text-dark-4 underline hover:text-dark transition-colors"
            >
              Limpiar todo
            </Link>
          </div>
        )}
      </div>

      {/* Result count */}
      <p className="mb-5 text-sm text-dark-4">
        {total === 0
          ? "Sin resultados"
          : `${from}–${to} de ${total} producto${total !== 1 ? "s" : ""}`}
      </p>

      {products.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <ShoppingBag className="h-12 w-12 text-gray-4 mb-4" />
          <p className="text-dark font-medium">No hay productos disponibles</p>
          <p className="text-sm text-dark-4 mt-1">
            Vuelve pronto, actualizamos el stock diariamente.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p: ProductWithRelations) => {
              const variants = p.product_variants ?? [];
              const minPrice = variants.reduce(
                (m, v) => Math.min(m, Number(v.price)),
                Number.POSITIVE_INFINITY,
              );
              const totalStock = variants.reduce(
                (s, v) => s + Number(v.stock),
                0,
              );
              const primaryImg =
                p.product_images?.find((i) => i.is_primary)?.url ??
                p.product_images?.[0]?.url;
              const conditions = Array.from(
                new Set(variants.map((v) => v.condition).filter(Boolean) as string[]),
              );

              return (
                <Link
                  key={p.id}
                  href={`/tienda/${p.id}`}
                  className="group bg-white border border-gray-3 rounded-xl overflow-hidden hover:shadow-3 transition-shadow"
                >
                  <div className="aspect-square bg-gray-1 relative">
                    {primaryImg ? (
                      <img
                        src={primaryImg}
                        alt={p.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Package className="h-12 w-12 text-gray-4" />
                      </div>
                    )}
                    {totalStock === 0 && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="text-xs font-medium text-dark-3 bg-white border border-gray-3 px-2 py-1 rounded-full">
                          Agotado
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">
                      {p.brand}
                    </p>
                    <p className="font-semibold text-dark text-sm mt-0.5 line-clamp-2">
                      {p.name}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {(conditions as string[]).slice(0, 2).map((c) => (
                        <span
                          key={c}
                          className="text-[10px] bg-gray-2 text-dark-4 px-1.5 py-0.5 rounded-full"
                        >
                          {CONDITION_LABEL[c] ?? c}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 flex items-end justify-between">
                      <p className="text-base font-bold text-dark">
                        {Number.isFinite(minPrice)
                          ? `Desde ${formatCurrency(minPrice)}`
                          : "-"}
                      </p>
                      <span className="text-xs text-green font-medium">
                        {p.warranty_months}m garantía
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* ── Pagination ───────────────────────────────────────────── */}
          {totalPages > 1 && (
            <nav
              aria-label="Paginación de productos"
              className="mt-12 flex items-center justify-center gap-1"
            >
              {/* Prev */}
              {currentPage > 1 ? (
                <Link
                  href={buildUrl({ page: String(currentPage - 1) })}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-3 bg-white text-dark-3 transition-colors hover:border-dark hover:text-dark"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="size-4" />
                </Link>
              ) : (
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-3 text-gray-4 cursor-not-allowed">
                  <ChevronLeft className="size-4" />
                </span>
              )}

              {/* Page numbers */}
              {buildPageNumbers(currentPage, totalPages).map((item, position) =>
                item === "…" ? (
                  <span key={`ellipsis-pos-${position}`} className="px-1 text-dark-4 select-none">…</span>
                ) : (
                  <Link
                    key={item}
                    href={buildUrl({ page: String(item) })}
                    aria-current={item === currentPage ? "page" : undefined}
                    className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors ${item === currentPage
                      ? "border-dark bg-dark text-white"
                      : "border-gray-3 bg-white text-dark-3 hover:border-dark hover:text-dark"
                      }`}
                  >
                    {item}
                  </Link>
                ),
              )}

              {/* Next */}
              {currentPage < totalPages ? (
                <Link
                  href={buildUrl({ page: String(currentPage + 1) })}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-3 bg-white text-dark-3 transition-colors hover:border-dark hover:text-dark"
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="size-4" />
                </Link>
              ) : (
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-3 text-gray-4 cursor-not-allowed">
                  <ChevronRight className="size-4" />
                </span>
              )}
            </nav>
          )}
        </>
      )}
    </section>
  );
}
