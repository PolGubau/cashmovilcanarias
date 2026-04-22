"use client";

import { Download, FileSpreadsheet, Printer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getData = async (): Promise<Record<string, unknown>[]> => {
    if (data !== undefined) return data;
    return fetchData!();
  };

  const exportExcel = async () => {
    setLoading(true);
    setOpen(false);
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
      // Auto column width
      ws["!cols"] = columns.map((_, i) => ({
        wch: Math.max(
          columns[i].label.length,
          ...wsData.slice(1).map((r) => String(r[i] ?? "").length),
        ),
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
    setOpen(false);
    try {
      const rows = await getData();
      const win = window.open("", "_blank");
      if (!win) return;
      const tableRows = rows
        .map(
          (row) =>
            `<tr>${columns
              .map((c) => {
                const val = row[c.key];
                const text = c.format ? c.format(val, row) : String(val ?? "");
                return `<td>${text}</td>`;
              })
              .join("")}</tr>`
        )
        .join("");

      win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>${title ?? filename}</title><style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,sans-serif;font-size:10px;padding:20px;color:#111}
h1{font-size:15px;margin-bottom:3px}
.meta{font-size:9px;color:#666;margin-bottom:14px}
table{width:100%;border-collapse:collapse}
th{background:#1a1a1a;color:#fff;text-align:left;padding:5px 7px;font-size:9px;text-transform:uppercase;letter-spacing:.04em}
td{padding:4px 7px;border-bottom:1px solid #eee;white-space:nowrap}
tr:nth-child(even) td{background:#f7f7f7}
@media print{@page{size:A4 landscape;margin:12mm}}
</style></head><body>
<h1>${title ?? filename}</h1>
<p class="meta">Generado el ${new Date().toLocaleString("es-ES")} &nbsp;·&nbsp; ${rows.length} registros</p>
<table><thead><tr>${columns.map((c) => `<th>${c.label}</th>`).join("")}</tr></thead>
<tbody>${tableRows}</tbody></table>
<script>window.onload=()=>{window.print();window.onafterprint=()=>window.close()}<\/script>
</body></html>`);
      win.document.close();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50 shadow-sm"
      >
        <Download className="w-3.5 h-3.5" />
        {loading ? "Exportando…" : label}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1 w-48">
          <button
            onClick={exportExcel}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            Excel (.xlsx)
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            PDF / Imprimir
          </button>
        </div>
      )}
    </div>
  );
}
