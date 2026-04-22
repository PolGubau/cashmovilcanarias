import Link from "next/link";

export interface FilterTab {
  value: string;
  label: string;
  count?: number;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeValue: string | undefined;
  baseHref: string;
  paramName?: string;
  allLabel?: string;
}

export default function FilterTabs({
  tabs,
  activeValue,
  baseHref,
  paramName = "status",
  allLabel = "Todos",
}: FilterTabsProps) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {/* "All" tab */}
      <Link
        href={baseHref}
        className={`
          relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium
          border transition-all duration-150 ease-out
          ${
            !activeValue
              ? "bg-dark text-white border-dark shadow-sm"
              : "bg-white text-dark-4 border-gray-3 hover:border-dark-3 hover:text-dark hover:bg-gray-1"
          }
        `}
      >
        {allLabel}
      </Link>

      {tabs.map((tab) => {
        const isActive = activeValue === tab.value;
        return (
          <Link
            key={tab.value}
            href={`${baseHref}?${paramName}=${tab.value}`}
            className={`
              relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium
              border transition-all duration-150 ease-out
              ${
                isActive
                  ? "bg-dark text-white border-dark shadow-sm"
                  : "bg-white text-dark-4 border-gray-3 hover:border-dark-3 hover:text-dark hover:bg-gray-1"
              }
            `}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`
                  inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-semibold px-1
                  ${isActive ? "bg-white/20 text-white" : "bg-gray-2 text-dark-4"}
                `}
              >
                {tab.count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
