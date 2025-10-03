// src/components/KPICard.jsx
import React from "react";
import { getKpiIcon } from "@/lib/kpiIcons";

export default function KPICard({ label, value, range, className = "" }) {
  const Icon = getKpiIcon(label);

  return (
    <div
      className={[
        "w-full",
        "grid grid-cols-[96px_1fr] items-center",
        "min-h-[120px] p-4 gap-4 rounded-[16px] border border-[#EEF0E8] bg-white",
        "shadow-[0_8px_18px_rgba(0,0,0,0.06)]",
        className,
      ].join(" ")}
    >
      {/* Icon circle */}
      <div className="flex items-center justify-center">
        <div className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-[#E3E8D9] shadow-[inset_0_2px_0_rgba(255,255,255,0.6),0_4px_10px_rgba(0,0,0,0.08)]">
          <Icon className="h-9 w-9 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
        </div>
      </div>

      {/* Text */}
      <div className="min-w-0">
        <div className="text-[22px] font-semibold text-gray-900 leading-tight">
          {label}
        </div>
        <div className="mt-1 text-[36px] leading-[1.1] font-semibold text-gray-900">
          {value}
        </div>
        <div className="mt-1 text-sm text-gray-400 truncate">{range}</div>
      </div>
    </div>
  );
}
