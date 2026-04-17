import type { ReactNode } from "react";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  emptyIcon?: ReactNode;
}

export default function DataTable<T extends object>({
  columns,
  data,
  emptyMessage = "No hay datos todavía",
  emptyIcon,
}: Props<T>) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    {emptyIcon && <div className="text-gray-300 mb-1">{emptyIcon}</div>}
                    <p className="text-[13px] font-medium text-gray-400">{emptyMessage}</p>
                    <p className="text-[12px] text-gray-300">Los registros aparecerán aquí cuando se añadan</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/70 transition-colors group">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-3.5 text-[13px] text-gray-600 whitespace-nowrap">
                      {col.render ? col.render(row) : ((row as Record<string, unknown>)[col.key] as ReactNode) ?? <span className="text-gray-300">-</span>}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
