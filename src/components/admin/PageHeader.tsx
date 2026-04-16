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
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-dark">{title}</h1>
        {description && (
          <p className="text-sm text-dark-4 mt-1">{description}</p>
        )}
      </div>
      {action && (
        isLinkAction(action) ? (
          <Link
            href={action.href}
            className="inline-flex items-center gap-2 bg-blue text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-dark transition-colors"
          >
            + {action.label}
          </Link>
        ) : (
          <>{action as ReactNode}</>
        )
      )}
    </div>
  );
}
