"use server";

import KPICard from "@/components/KPICard";
import SpinwheelClient from "./SpinwheelClient";
import { getArisanRekap, getSpinCandidates } from "@/server/queries/arisan";

function first(v) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  const year = sp?.year ? Number(first(sp.year)) : new Date().getFullYear();

  // KPI
  const rekap = await getArisanRekap({ page: 1, year });
  const kpi = rekap.kpi;

  // semua kandidat
  const segments = await getSpinCandidates({ year });

  const kpis = [
    {
      label: "Pemasukan",
      value: kpi.pemasukanFormatted,
      range: kpi.rangeLabel,
    },
    {
      label: "Pengeluaran",
      value: kpi.pengeluaranFormatted,
      range: kpi.rangeLabel,
    },
    { label: "Saldo", value: kpi.saldoFormatted, range: kpi.rangeLabel },
  ];

  return (
    <div className="pb-10">
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 px-4">
        {kpis.map((k) => (
          <KPICard
            key={k.label}
            label={k.label}
            value={k.value}
            range={k.range}
          />
        ))}
      </div>
      <SpinwheelClient initialSegments={segments} />
    </div>
  );
}
