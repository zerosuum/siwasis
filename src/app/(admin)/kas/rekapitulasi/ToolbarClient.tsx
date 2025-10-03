"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar as IconCalendar,
  Download as IconDownload,
  Pencil as IconEdit,
  Search as IconSearch,
  SlidersHorizontal as IconFilter,
} from "lucide-react";

export default function ToolbarClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const [year, setYear] = React.useState<number>(
    Number(sp.get("year")) || new Date().getFullYear()
  );

  const applyYear = (y: number) => {
    const params = new URLSearchParams(sp.toString());
    params.set("year", String(y));
    router.push(`/kas/rekapitulasi?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <select
        className="h-9 w-[138px] rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-500 shadow-xs outline-none focus:ring-2 focus:ring-gray-200"
        value={year}
        onChange={(e) => {
          const v = Number(e.target.value);
          setYear(v);
          applyYear(v);
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => {
          const y = new Date().getFullYear() - i;
          return (
            <option key={y} value={y}>
              Periode {y}
            </option>
          );
        })}
      </select>

      <button
        type="button"
        className="h-9 w-9 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
        title="Pencarian"
        onClick={() => {
          alert("Fungsi pencarian belum dihubungkan");
        }}
      >
        <IconSearch size={20} />
      </button>

      <button
        type="button"
        className="h-9 w-9 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
        title="Filter"
        onClick={() => {
          const el = document.querySelector(
            '[data-hook="rekap-filter-trigger"]'
          ) as HTMLButtonElement | null;
          el?.click();
        }}
      >
        <IconFilter size={20} />
      </button>

      <button
        type="button"
        className="h-9 w-9 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
        title="Pilih rentang tanggal"
        onClick={() => {
          const el = document.querySelector(
            '[data-hook="rekap-range-trigger"]'
          ) as HTMLButtonElement | null;
          el?.click();
        }}
      >
        <IconCalendar size={20} />
      </button>

      <button
        type="button"
        className="h-9 w-9 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
        title="Unduh"
        onClick={() => {
          const el = document.querySelector(
            '[data-hook="rekap-download"]'
          ) as HTMLButtonElement | null;
          el?.click();
        }}
      >
        <IconDownload size={20} />
      </button>

      <button
        type="button"
        className="h-9 w-9 flex items-center justify-center rounded-md bg-[#0F172A] text-white"
        title="Edit"
        onClick={() => {
          const el = document.querySelector(
            '[data-hook="rekap-edit"]'
          ) as HTMLButtonElement | null;
          el?.click();
        }}
      >
        <IconEdit size={20} />
      </button>
    </div>
  );
}
