"use server";

import KPICard from "@/components/KPICard";
import SpinwheelClient from "./SpinwheelClient";
import { getArisanRekap, getSpinCandidates } from "@/server/queries/arisan";
import { getPeriodes } from "@/server/queries/periode";

function first(v) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function Page({ searchParams }) {
  const sp = await searchParams;

  const periodeResp = await getPeriodes().catch(() => null);
  const periodes = Array.isArray(periodeResp?.data) ? periodeResp.data : [];

  let periodeId = sp?.periode ? Number(first(sp.periode)) : null;
  if (!periodeId && periodes.length) {
    periodeId = periodes[0].id;
  }

  let kpi = {
    pemasukanFormatted: "Rp 0",
    pengeluaranFormatted: "Rp 0",
    saldoFormatted: "Rp 0",
    rangeLabel: "",
  };
  let segments = [];

  if (periodeId) {

    const rekap = await getArisanRekap({ page: 1, periode_id: periodeId });
    kpi = rekap.kpi;

    segments = await getSpinCandidates({ periode_id: periodeId });
  }

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

      <SpinwheelClient
        initialSegments={segments}
        periodes={periodes}
        activePeriodeId={periodeId}
      />
    </div>
  );
}
