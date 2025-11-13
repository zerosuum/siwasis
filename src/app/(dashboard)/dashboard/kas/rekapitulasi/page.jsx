import { getKasRekap } from "@/server/queries/kas";
import RekapClient from "./RekapClient";
import KPICard from "@/components/KPICard";
import { first } from "@/lib/utils";
import { getAdminProfile } from "@/lib/session";

export const dynamic = "force-dynamic";
const defaultData = {
  meta: { year: new Date().getFullYear(), nominalFormatted: "Rp 0" },
  kpi: {
    pemasukanFormatted: "Rp 0",
    pengeluaranFormatted: "Rp 0",
    saldoFormatted: "Rp 0",
    rangeLabel: "Tidak ada data",
  },
  rows: [],
  dates: [],
  total: 0,
  page: 1,
  perPage: 10,
};

function normalizeKasRekap(resp) {
  if (!resp || resp.ok === false) return defaultData;

  const pag = resp.pagination || {};
  return {
    ...resp,
    rows: resp.rows ?? resp.data ?? [],
    page: resp.page ?? pag.current_page ?? 1,
    perPage: resp.perPage ?? pag.per_page ?? 10,
    total: resp.total ?? pag.total ?? 0,
    meta: resp.meta ?? {
      year: resp.filters?.year
        ? Number(resp.filters.year)
        : new Date().getFullYear(),
      nominalFormatted: resp.nominalFormatted ?? "Rp 0",
    },
    kpi: resp.kpi ?? defaultData.kpi,
  };
}

export default async function Page({ searchParams }) {
  const profile = await getAdminProfile();
  const isLoggedIn = !!profile;

  const sp = await searchParams;

  const page = sp?.page ? Number(first(sp.page)) : 1;
  const year = sp?.year ? Number(first(sp.year)) : new Date().getFullYear();
  const from = sp?.from ? String(first(sp.from)) : null;
  const to = sp?.to ? String(first(sp.to)) : null;
  const q = sp?.q ? String(first(sp.q)) : "";
  const min = sp?.min ? Number(first(sp.min)) : undefined;
  const max = sp?.max ? Number(first(sp.max)) : undefined;
  const rt = sp?.rt ? String(first(sp.rt)) : "all";

  let initial = defaultData;
  try {
    const resp = await getKasRekap({ page, year, q, rt, from, to, min, max });
    initial = normalizeKasRekap(resp);
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
          <KPICard
            key={k.label}
            label={k.label}
            value={k.value}
            range={k.range}
          />
        ))}
      </div>
      <div className="mt-2">
        <RekapClient initial={initial} readOnly={!isLoggedIn} />
      </div>
    </div>
  );
}