import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "blue" | "green" | "yellow" | "red" | "orange";
}

const colorMap = {
  blue:   { bg: "bg-blue-light-5", icon: "text-blue",        border: "border-blue-light-4" },
  green:  { bg: "bg-green-light-6", icon: "text-green-dark",  border: "border-green-light-5" },
  yellow: { bg: "bg-yellow-light-4", icon: "text-yellow-dark", border: "border-yellow-light-1" },
  red:    { bg: "bg-red-light-6",   icon: "text-red-dark",    border: "border-red-light-4" },
  orange: { bg: "bg-orange/10",     icon: "text-orange-dark", border: "border-orange/20" },
};

export default function StatsCard({ title, value, subtitle, icon: Icon, color = "blue" }: Props) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-xl border border-gray-3 p-6 flex items-start gap-4">
      <div className={`w-12 h-12 ${c.bg} border ${c.border} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${c.icon}`} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-dark-4 font-medium">{title}</p>
        <p className="text-2xl font-bold text-dark mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-dark-5 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
