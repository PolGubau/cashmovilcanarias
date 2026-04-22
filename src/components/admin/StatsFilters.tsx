"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

const BRANDS = ["Apple", "Samsung", "Xiaomi", "Google", "Huawei", "OnePlus", "Motorola"];

const PRESETS = [
  { label: "Hoy", value: "today" },
  { label: "7 días", value: "7d" },
  { label: "30 días", value: "30d" },
  { label: "90 días", value: "90d" },
  { label: "Todo", value: "all" },
];

function getPresetDates(preset: string): { from: string; to: string } | null {
  const now = new Date();
  const pad = (d: Date) => d.toISOString().slice(0, 10);
  const today = pad(now);
  if (preset === "today") return { from: today, to: today };
  if (preset === "7d") {
    const d = new Date(now); d.setDate(d.getDate() - 7);
    return { from: pad(d), to: today };
  }
  if (preset === "30d") {
    const d = new Date(now); d.setDate(d.getDate() - 30);
    return { from: pad(d), to: today };
  }
  if (preset === "90d") {
    const d = new Date(now); d.setDate(d.getDate() - 90);
    return { from: pad(d), to: today };
  }
  return null; // "all"
}

export default function StatsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";
  const brand = searchParams.get("brand") ?? "";

  const push = useCallback(
    (params: Record<string, string>) => {
      const sp = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([k, v]) => {
        if (v) sp.set(k, v);
        else sp.delete(k);
      });
      startTransition(() => router.push(`${pathname}?${sp.toString()}`));
    },
    [pathname, router, searchParams],
  );

  function applyPreset(preset: string) {
    const dates = getPresetDates(preset);
    push({ dateFrom: dates?.from ?? "", dateTo: dates?.to ?? "" });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-end">
      {/* Presets */}
      <div className="flex gap-1.5 flex-wrap">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            onClick={() => applyPreset(p.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
              border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="w-px h-7 bg-gray-200 hidden sm:block" />

      {/* Custom date range */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500 font-medium">Desde</label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => push({ dateFrom: e.target.value })}
          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue/30"
        />
        <label className="text-xs text-gray-500 font-medium">Hasta</label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => push({ dateTo: e.target.value })}
          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue/30"
        />
      </div>

      <div className="w-px h-7 bg-gray-200 hidden sm:block" />

      {/* Brand filter */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500 font-medium">Marca</label>
        <select
          value={brand}
          onChange={(e) => push({ brand: e.target.value })}
          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue/30"
        >
          <option value="">Todas</option>
          {BRANDS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Clear */}
      {(dateFrom || dateTo || brand) && (
        <button
          onClick={() => push({ dateFrom: "", dateTo: "", brand: "" })}
          className="text-xs text-gray-400 hover:text-gray-600 underline ml-auto"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
