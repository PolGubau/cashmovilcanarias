import { Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  action?: { label: string; href: string } | ReactNode;
}

function isLinkAction(action: unknown): action is { label: string; href: string } {
  return typeof action === "object" && action !== null && "href" in action && "label" in action;
}

export default function PageHeader({ title, description, action }: Props) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-7">
      <div className="min-w-0">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight truncate">{title}</h1>
        {description && (
          <p className="text-[13px] text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      {action && (
        isLinkAction(action) ? (
          <Link
            href={action.href}
            className="inline-flex items-center gap-1.5 bg-gray-900 text-white text-[13px] font-medium px-3.5 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{action.label}</span>
            <span className="sm:hidden">Nuevo</span>
          </Link>
        ) : (
          <div className="shrink-0">{action as ReactNode}</div>
        )
      )}
    </div>
  );
}
