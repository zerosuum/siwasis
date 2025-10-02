// src/app/(admin)/kas/laporan/page.jsx

import { getKasLaporan } from "@/server/queries/kas";
import LaporanClient from "./LaporanClient";
import { Card } from "@/components/Card";

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

  return (
    <div className="pb-10">
      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm text-gray-500">Pemasukan</div>
          <div className="mt-1 text-2xl font-semibold">
            {initial.kpi.pemasukanFormatted}
          </div>
          <div className="mt-1 text-xs text-gray-400">
            {initial.kpi.rangeLabel}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Pengeluaran</div>
          <div className="mt-1 text-2xl font-semibold">
            {initial.kpi.pengeluaranFormatted}
          </div>
          <div className="mt-1 text-xs text-gray-400">
            {initial.kpi.rangeLabel}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Saldo</div>
          <div className="mt-1 text-2xl font-semibold">
            {initial.kpi.saldoFormatted}
          </div>
          <div className="mt-1 text-xs text-gray-400">
            {initial.kpi.rangeLabel}
          </div>
        </Card>
      </div>

      <LaporanClient initial={initial} />
    </div>
  );
}
