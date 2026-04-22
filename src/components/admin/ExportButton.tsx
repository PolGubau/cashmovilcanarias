"use client";

import { cn } from "@/lib/utils";
import { Download, FileSpreadsheet, Loader2, Printer } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { useState } from "react";
import * as XLSX from "xlsx";

export interface ExportColumn {
  key: string;
  label: string;
  format?: (val: unknown, row: Record<string, unknown>) => string;
}

type Props = {
  columns: ExportColumn[];
  filename: string;
  title?: string;
  label?: string;
} & (
    | { data: Record<string, unknown>[]; fetchData?: never }
    | { data?: never; fetchData: () => Promise<Record<string, unknown>[]> }
  );

export function ExportButton({
  columns,
  filename,
  title,
  label = "Exportar",
  data,
  fetchData,
}: Props) {
  const [loading, setLoading] = useState(false);

  const getData = async (): Promise<Record<string, unknown>[]> => {
    if (data !== undefined) return data;
    return fetchData?.();
  };

  const exportExcel = async () => {
    setLoading(true);
    try {
      const rows = await getData();
      const wsData = [
        columns.map((c) => c.label),
        ...rows.map((row) =>
          columns.map((c) => {
            const val = row[c.key];
            return c.format ? c.format(val, row) : (val ?? "");
          })
        ),
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws["!cols"] = columns.map((_, i) => ({
        wch: Math.max(columns[i].label.length, ...wsData.slice(1).map((r) => String(r[i] ?? "").length)),
      }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Informe");
      XLSX.writeFile(wb, `${filename}.xlsx`);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    setLoading(true);
    try {
      const rows = await getData();
      const win = window.open("", "_blank");
      if (!win) return;
      const tableRows = rows
        .map((row) => `<tr>${columns.map((c) => `<td>${c.format ? c.format(row[c.key], row) : String(row[c.key] ?? "")}</td>`).join("")}</tr>`)
        .join("");
      win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${title ?? filename}</title><style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:10px;padding:20px;color:#111}
h1{font-size:15px;margin-bottom:3px}.meta{font-size:9px;color:#666;margin-bottom:14px}
table{width:100%;border-collapse:collapse}th{background:#1a1a1a;color:#fff;text-align:left;padding:5px 7px;font-size:9px;text-transform:uppercase;letter-spacing:.04em}
td{padding:4px 7px;border-bottom:1px solid #eee;white-space:nowrap}tr:nth-child(even) td{background:#f7f7f7}
@media print{@page{size:A4 landscape;margin:12mm}}</style></head><body>
<h1>${title ?? filename}</h1><p class="meta">Generado el ${new Date().toLocaleString("es-ES")} · ${rows.length} registros</p>
<table><thead><tr>${columns.map((c) => `<th>${c.label}</th>`).join("")}</tr></thead><tbody>${tableRows}</tbody></table>
<script>window.onload=()=>{window.print();window.onafterprint=()=>window.close()}<\/script></body></html>`);
      win.document.close();
    } finally {
      setLoading(false);
    }
  };

  const itemClass = cn(
    "flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 rounded-md",
    "cursor-pointer outline-none select-none",
    "hover:bg-gray-100 focus:bg-gray-100",
    "data-[disabled]:opacity-40 data-[disabled]:pointer-events-none",
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          disabled={loading}
          className={cn(
            "inline-flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-lg",
            "border border-gray-200 bg-white text-gray-700 shadow-sm",
            "hover:border-gray-400 hover:text-gray-900 transition-colors",
            "disabled:opacity-50 disabled:pointer-events-none",
            "data-[state=open]:border-gray-400",
          )}
        >
          {loading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Download className="w-3.5 h-3.5" />}
          {loading ? "Exportando…" : label}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className={cn(
            "z-50 min-w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          )}
        >
          <DropdownMenu.Item className={itemClass} onSelect={exportExcel}>
            <FileSpreadsheet className="w-4 h-4 text-green-600 shrink-0" />
            Excel (.xlsx)
          </DropdownMenu.Item>
          <DropdownMenu.Item className={itemClass} onSelect={exportPDF}>
            <Printer className="w-4 h-4 text-blue-600 shrink-0" />
            PDF / Imprimir
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
