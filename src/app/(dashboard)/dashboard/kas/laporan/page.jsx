import { getKasLaporan } from "@/server/queries/kas";
import LaporanClient from "./LaporanClient";
import KPICard from "@/components/KPICard";
import { first } from "@/lib/utils";
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


  const page = sp?.page ? Number(first(sp.page)) : 1;
  const year = sp?.year ? Number(first(sp.year)) : new Date().getFullYear();
  const from = sp?.from ? String(first(sp.from)) : null;
  const to = sp?.to ? String(first(sp.to)) : null;
  const q = sp?.q ? String(first(sp.q)) : "";
  const type = sp?.type ? String(first(sp.type)) : null;
  const min = sp?.min ? Number(first(sp.min)) : undefined;
  const max = sp?.max ? Number(first(sp.max)) : undefined;
  const rt = sp?.rt ? String(first(sp.rt)) : "all";

  // const initial =
  //   (await getKasLaporan({ page, year, from, to, q })) || defaultData;

  // const resp = await getKasLaporan({ page, year, from, to, q, type, min, max });
  // const initial = resp && resp.ok === false ? defaultData : (resp || defaultData);

  let initial = defaultData;
  try {
    const resp = await getKasLaporan({
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
  } catch (_) {
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
          <KPICard
            key={k.label}
            label={k.label}
            value={k.value}
            range={k.range}
          />
        ))}
      </div>
      <LaporanClient initial={initial} readOnly={!isLoggedIn} />
    </div>
  );
}
