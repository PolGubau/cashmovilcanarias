import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "blue" | "green" | "yellow" | "red" | "orange";
}

const colorMap: Record<string, { iconBg: string; iconColor: string; dot: string }> = {
  blue: { iconBg: "bg-blue/10", iconColor: "text-blue", dot: "bg-blue" },
  green: { iconBg: "bg-green/10", iconColor: "text-green-dark", dot: "bg-green-dark" },
  yellow: { iconBg: "bg-yellow/10", iconColor: "text-yellow-dark", dot: "bg-yellow-dark" },
  red: { iconBg: "bg-red/10", iconColor: "text-red-dark", dot: "bg-red-dark" },
  orange: { iconBg: "bg-orange/10", iconColor: "text-orange-dark", dot: "bg-orange" },
};

export default function StatsCard({ title, value, subtitle, icon: Icon, color = "blue" }: Props) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 ${c.iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-4.5 h-4.5 ${c.iconColor}`} />
        </div>
        <span className={`w-2 h-2 rounded-full ${c.dot} opacity-60`} />
      </div>
      <div>
        <p className="text-[13px] text-gray-500 font-medium">{title}</p>
        <p className="text-[28px] font-bold text-gray-900 leading-tight mt-0.5 tracking-tight">{value}</p>
        {subtitle && (
          <p className="text-[12px] text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
