// src/app/(admin)/kas/laporan/page.jsx
import { getKasLaporan } from "@/server/queries/kas";
import LaporanClient from "./LaporanClient";
import KPICard from "@/components/KPICard";

export const dynamic = "force-dynamic";

function first(v) {
  return Array.isArray(v) ? v[0] : v;
}

const defaultData = {
  rows: [],
  total: 0,
  page: 1,
  perPage: 15,
  kpi: {
    pemasukanFormatted: "Rp 0",
    pengeluaranFormatted: "Rp 0",
    saldoFormatted: "Rp 0",
    rangeLabel: "Tidak ada data",
  },
};

export default async function Page({ searchParams }) {
  const sp = await searchParams;

  const page = sp?.page ? Number(first(sp.page)) : 1;
  const from = sp?.from ? String(first(sp.from)) : null;
  const to = sp?.to ? String(first(sp.to)) : null;
  const q = sp?.q ? String(first(sp.q)) : "";

  const initial = (await getKasLaporan({ page, from, to, q })) || defaultData;

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

      <LaporanClient initial={initial} />
    </div>
  );
}
