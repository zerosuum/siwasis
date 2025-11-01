import KPICard from "@/components/KPICard";
import JimpitanClient from "./JimpitanClient";
import { getJimpitanLaporan } from "@/server/queries/jimpitan";
import { getAdminProfile } from "@/lib/session";

export const dynamic = "force-dynamic";

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
  const profile = await getAdminProfile();
  const isLoggedIn = !!profile;
  const sp = await searchParams;
  const page = sp?.page ? Number(sp.page) : 1;
  const year = sp?.year ? Number(sp.year) : new Date().getFullYear();
  const from = sp?.from ?? null;
  const to = sp?.to ?? null;
  const q = sp?.q ?? "";
  const type = sp?.type ?? null;
  const min = sp?.min ? Number(sp.min) : undefined;
  const max = sp?.max ? Number(sp.max) : undefined;

  let initial;
  try {
    const resp = await getJimpitanLaporan({
      page,
      year,
      from,
      to,
      q,
      type,
      min,
      max,
    });
    initial = resp && resp.ok === false ? defaultData : resp || defaultData;
  } catch {
    initial = defaultData;
  }

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
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {kpis.map((k) => (
          <KPICard key={k.label} {...k} />
        ))}
      </div>
      <JimpitanClient initial={initial} readOnly={!isLoggedIn} />
    </div>
  );
}
