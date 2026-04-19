"use client";

import { cn } from "@/lib/utils";
import {
  ArrowRight, BatteryCharging, Clock, Headphones, Package,
  RefreshCw, Search, Shield, Smartphone, Star, Tablet, TrendingUp,
  Watch, X, Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Static data ─────────────────────────────────────────────────────────────

const POPULAR: string[] = [
  "iPhone 15 Pro", "Samsung Galaxy S24", "AirPods Pro",
  "Apple Watch", "iPad Pro", "Xiaomi 14", "Samsung A55",
];

const CATEGORIES = [
  { label: "iPhone", href: "/tienda?brand=Apple&category=smartphone", Icon: Smartphone, bg: "bg-gray-2", fg: "text-dark" },
  { label: "Samsung", href: "/tienda?brand=Samsung&category=smartphone", Icon: Smartphone, bg: "bg-blue/10", fg: "text-blue" },
  { label: "Xiaomi", href: "/tienda?brand=Xiaomi&category=smartphone", Icon: Smartphone, bg: "bg-orange/10", fg: "text-orange" },
  { label: "iPad", href: "/tienda?category=tablet&brand=Apple", Icon: Tablet, bg: "bg-gray-2", fg: "text-dark" },
  { label: "Smartwatch", href: "/tienda?category=smartwatch", Icon: Watch, bg: "bg-green/10", fg: "text-green" },
  { label: "Auriculares", href: "/tienda?category=auriculares", Icon: Headphones, bg: "bg-blue/10", fg: "text-blue" },
  { label: "Fundas", href: "/tienda?category=fundas_protectores", Icon: Shield, bg: "bg-orange/10", fg: "text-orange" },
  { label: "Cargadores", href: "/tienda?category=cargadores_cables", Icon: Zap, bg: "bg-yellow/10", fg: "text-yellow-dark" },
  { label: "Power Bank", href: "/tienda?category=power_bank", Icon: BatteryCharging, bg: "bg-green/10", fg: "text-green" },
  { label: "Guess", href: "/tienda?category=guess", Icon: Star, bg: "bg-red/10", fg: "text-red" },
  { label: "Reacondicionados", href: "/tienda?condition=like_new", Icon: RefreshCw, bg: "bg-teal/10", fg: "text-teal" },
  { label: "Novedades", href: "/tienda?sort=newest", Icon: Package, bg: "bg-blue/10", fg: "text-blue" },
] as const;

const STORAGE_KEY = "cashMovil_recent_searches";
const MAX_RECENT = 5;

// ─── Component ───────────────────────────────────────────────────────────────

interface Props { open: boolean; onClose: () => void; }

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [recents, setRecents] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recents on open
  useEffect(() => {
    if (!open) return;
    try { setRecents(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")); } catch { }
    setQuery("");
    setActiveIdx(-1);
    setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  const saveRecent = useCallback((term: string) => {
    const next = [term, ...recents.filter(s => s !== term)].slice(0, MAX_RECENT);
    setRecents(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { }
  }, [recents]);

  const go = useCallback((term: string) => {
    if (!term.trim()) return;
    saveRecent(term.trim());
    router.push(`/tienda?search=${encodeURIComponent(term.trim())}`);
    onClose();
  }, [router, onClose, saveRecent]);

  const suggestions = query ? [] : recents;

  // Keyboard handler
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)); }
      if (e.key === "Enter") {
        if (activeIdx >= 0 && suggestions[activeIdx]) go(suggestions[activeIdx]);
        else if (query.trim()) go(query);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, activeIdx, suggestions, query, go, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Búsqueda de productos"
        className="fixed left-1/2 top-[8%] sm:top-[12%] -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-2xl z-[9999] rounded-2xl bg-white shadow-2xl border border-gray-3 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-3">
          <Search className="size-5 text-dark-4 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); go(query); } }}
            placeholder="Busca un producto, marca o categoría..."
            className="flex-1 text-base text-dark placeholder:text-dark-4 bg-transparent outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <div className="flex items-center gap-2 shrink-0">
            {query && (
              <button onClick={() => { setQuery(""); inputRef.current?.focus(); }} aria-label="Borrar búsqueda" className="text-dark-4 hover:text-dark transition-colors p-0.5 rounded">
                <X className="size-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center rounded bg-gray-1 px-1.5 py-0.5 text-xs text-dark-4 font-mono border border-gray-3">Esc</kbd>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="max-h-[72vh] overflow-y-auto overscroll-contain divide-y divide-gray-3/60">

          {/* → "Buscar X" shortcut when typing */}
          {query.trim() && (
            <div className="px-4 py-3">
              <button
                onClick={() => go(query)}
                className="w-full flex items-center justify-between rounded-xl px-4 py-3 bg-blue/5 hover:bg-blue/10 text-blue transition-colors group"
              >
                <span className="flex items-center gap-3 text-sm font-medium">
                  <Search className="size-4 shrink-0" />
                  Buscar <strong className="ml-0.5">"{query}"</strong>
                </span>
                <ArrowRight className="size-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* → Recent searches */}
          {recents.length > 0 && !query && (
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center justify-between mb-2.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-dark-4 uppercase tracking-wider">
                  <Clock className="size-3" /> Recientes
                </span>
                <button onClick={() => { setRecents([]); localStorage.removeItem(STORAGE_KEY); }} className="text-xs text-dark-4 hover:text-dark transition-colors">
                  Borrar todo
                </button>
              </div>
              <ul className="space-y-0.5">
                {recents.map((term, i) => (
                  <li
                    key={term}
                    className={cn("flex items-center justify-between rounded-xl px-3 py-2 cursor-pointer transition-colors", activeIdx === i ? "bg-blue/5 text-blue" : "hover:bg-gray-1")}
                    onClick={() => go(term)}
                  >
                    <span className="flex items-center gap-2.5 text-sm text-dark">
                      <Clock className="size-3.5 text-dark-4 shrink-0" /> {term}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); const next = recents.filter(s => s !== term); setRecents(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }}
                      className="text-dark-4 hover:text-dark p-0.5 rounded transition-colors"
                      aria-label={`Eliminar "${term}" de recientes`}
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* → Popular searches */}
          {!query && (
            <div className="px-4 py-3.5">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-dark-4 uppercase tracking-wider mb-3">
                <TrendingUp className="size-3" /> Populares
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((term) => (
                  <button
                    key={term}
                    onClick={() => go(term)}
                    className="text-xs font-medium rounded-full px-3 py-1.5 bg-gray-1 text-dark-3 border border-gray-3 hover:border-blue hover:text-blue hover:bg-blue/5 transition-all duration-150"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* → Category grid */}
          {!query && (
            <div className="px-4 pt-3.5 pb-5">
              <span className="text-xs font-semibold text-dark-4 uppercase tracking-wider block mb-3">
                Explorar categorías
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {CATEGORIES.map(({ label, href, Icon, bg, fg }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className="flex flex-col items-center gap-2 rounded-xl p-3 hover:bg-gray-1 transition-colors group"
                  >
                    <span className={cn("flex items-center justify-center w-10 h-10 rounded-xl group-hover:scale-110 transition-transform duration-150", bg, fg)}>
                      <Icon className="size-5" />
                    </span>
                    <span className="text-xs font-medium text-dark-3 text-center leading-tight">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
