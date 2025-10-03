// src/app/(admin)/kas/rekapitulasi/page.jsx
import { getKasRekap } from "@/server/queries/kas";
import RekapClient from "./RekapClient";
import KPICard from "@/components/KPICard";

export const dynamic = "force-dynamic";

function first(v) {
  return Array.isArray(v) ? v[0] : v;
}

const defaultData = {
  meta: { nominalFormatted: "Rp 0" },
  kpi: {
    pemasukanFormatted: "Rp 0",
    pengeluaranFormatted: "Rp 0",
    saldoFormatted: "Rp 0",
    rangeLabel: "Tidak ada data",
  },
  rows: [],
  dates: [],
};

export default async function Page({ searchParams }) {
  const sp = await searchParams;

  const year =
    sp?.year !== undefined ? Number(first(sp.year)) : new Date().getFullYear();
  const from = sp?.from ? String(first(sp.from)) : null;
  const to = sp?.to ? String(first(sp.to)) : null;
  const q = sp?.q ? String(first(sp.q)) : "";
  const rt = sp?.rt ? String(first(sp.rt)) : "";

  const initial =
    (await getKasRekap({ year, from, to, search: q, rt })) || defaultData;

  const kpis = [
    {
      label: "Pemasukan",
      value: initial.kpi.pemasukanFormatted,
      range: initial.kpi.rangeLabel,
    },
    {
      label: "Pengeluaran",
      value: initial.kpi.pengeluaranFormatted,
      range: initial.kpi.rangeLabel,
    },
    {
      label: "Saldo",
      value: initial.kpi.saldoFormatted,
      range: initial.kpi.rangeLabel,
    },
  ];

  return (
    <div className="pb-10">
      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {kpis.map((k) => (
          <KPICard
            key={k.label}
            label={k.label}
            value={k.value}
            range={k.range}
          />
        ))}
      </div>

      <div className="mt-2">
        <RekapClient initial={initial} />
      </div>
    </div>
  );
}
