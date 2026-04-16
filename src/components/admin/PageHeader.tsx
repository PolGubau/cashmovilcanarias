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
    <div className="flex items-center justify-between mb-7">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">{title}</h1>
        {description && (
          <p className="text-[13px] text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      {action && (
        isLinkAction(action) ? (
          <Link
            href={action.href}
            className="inline-flex items-center gap-1.5 bg-gray-900 text-white text-[13px] font-medium px-3.5 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            {action.label}
          </Link>
        ) : (
          <>{action as ReactNode}</>
        )
      )}
    </div>
  );
}
