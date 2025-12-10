import KPICard from "@/components/KPICard";
import RekapClient from "./RekapClient";
import { getKasRekap } from "@/server/queries/kas";
import { getPeriodes } from "@/server/queries/periode";
import { getAdminProfile } from "@/lib/session";
import { first } from "@/lib/utils";

export const dynamic = "force-dynamic";

const fallback = {
  meta: {
    nominal: 0,
    nominalFormatted: "Rp 0",
    nominalPerEventFormatted: "Rp 0",
    year: new Date().getFullYear(),
    periodeId: null,
  },
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
  periodes: [],
};

export default async function Page({ searchParams }) {
  const profile = await getAdminProfile();
  const isLoggedIn = !!profile;

  const sp = await searchParams;
  const page = sp?.page ? Number(first(sp.page)) : 1;
  const q = sp?.q ? String(first(sp.q)) : "";
  const rt = sp?.rt ? String(first(sp.rt)) : "all";
  const from = sp?.from ? String(first(sp.from)) : undefined;
  const to = sp?.to ? String(first(sp.to)) : undefined;
  const min = sp?.min ? Number(first(sp.min)) : undefined;
  const max = sp?.max ? Number(first(sp.max)) : undefined;
  const periodeIdFromUrl = sp?.periode_id ? Number(first(sp.periode_id)) : null;

  const periodeResp = await getPeriodes();
  const periodes = Array.isArray(periodeResp?.data)
    ? periodeResp.data
    : Array.isArray(periodeResp)
    ? periodeResp
    : [];

  let activePeriode =
    periodes.find((p) => p.id === periodeIdFromUrl) ||
    periodes.find((p) => p.is_active) ||
    periodes[0] ||
    null;

  const periodeId = activePeriode?.id ?? null;

  let initial = fallback;
  try {
    initial = await getKasRekap({
      page,
      perPage: 10,
      periodeId,
      q,
      rt,
      from,
      to,
      min,
      max,
    });
  } catch (err) {
    console.error("getKasRekap error:", err);
    initial = fallback;
  }

  initial.periodes = periodes;
  initial.periodeId = periodeId;
  if (initial.meta) {
    initial.meta.periodeId = periodeId;
  }

  function getCurrentPage(initial) {
    if (initial?.data?.current_page) return initial.data.current_page;
    if (initial?.meta?.current_page) return initial.meta.current_page;
    if (initial?.page) return initial.page;
    return 1;
  }

  const kpis = [
    {
      label: "Pemasukan Kas",
      value: initial.kpi.pemasukanFormatted,
      range: `Halaman ${getCurrentPage(initial)}`,
    },
    {
      label: "Pengeluaran Kas",
      value: initial.kpi.pengeluaranFormatted,
      range: `Halaman ${getCurrentPage(initial)}`,
    },
    {
      label: "Saldo Kas",
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
