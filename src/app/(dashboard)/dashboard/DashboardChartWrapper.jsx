"use client";

import { BarChart } from "@/components/BarChart";
import { toRp } from "@/lib/format";

export default function DashboardChartWrapper({
  chartData = [],
  fillContainer = false,
}) {
  const valueFormatter = (v) => toRp(Number(v) || 0);

  const handleValueChange = (value) => {
    console.log("BarChart Value Changed:", value);
  };

  return (
    <div
      className={`lg:col-span-8 rounded-2xl border border-[#EEF0E8] bg-white p-4 shadow-sm ${
        fillContainer ? "h-full" : ""
      }`}
    >
      <BarChart
        className={fillContainer ? "h-full" : "h-80"}
        data={chartData}
        index="label"
        categories={["Pemasukan", "Pengeluaran"]}
        colors={["muted", "primary"]} 
        valueFormatter={valueFormatter} 
        yAxisWidth={100}
        showLegend
        legendPosition="center"
        showGridLines={false}
        onValueChange={handleValueChange}
      />
    </div>
  );
}
