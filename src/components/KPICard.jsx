import React from "react";
import { getKpiIcon } from "@/lib/kpiIcons";

export default function KPICard({ label, value, range, className = "" }) {
  const Icon = getKpiIcon(label);

  return (
    <div
      className={[
        "w-full",
        "flex flex-col items-center text-center",
        "md:grid md:grid-cols-[96px_1fr] md:items-center md:text-left",
        "min-h-[120px] p-4 gap-4 rounded-[16px] border border-[#EEF0E8] bg-white",
        "shadow-[0_8px_18px_rgba(0,0,0,0.06)]",
        className,
      ].join(" ")}
    >
      <div className="flex items-center justify-center">
        <div className="flex h-20 w-20 md:h-[96px] md:w-[96px] items-center justify-center rounded-full bg-[#E3E8D9] shadow-[inset_0_2px_0_rgba(255,255,255,0.6),0_4px_10px_rgba(0,0,0,0.08)]">
          <Icon className="h-8 w-8 md:h-9 md:w-9 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
        </div>
      </div>

      <div className="min-w-0">
        <div className="text-lg md:text-xl lg:text-[22px] font-semibold text-gray-900 leading-tight break-words">
          {label}
        </div>

        <div className="mt-1 text-3xl sm:text-2xl md:text-3xl lg:text-[36px] leading-[1.1] font-semibold text-gray-900 truncate">
          {value}
        </div>

        <div className="mt-1 text-sm text-gray-400 truncate">{range}</div>
      </div>
    </div>
  );
}
