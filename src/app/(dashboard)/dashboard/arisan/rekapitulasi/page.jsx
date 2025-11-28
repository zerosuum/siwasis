import KPICard from "@/components/KPICard";
import ArisanRekapClient from "./RekapClient";
import { getArisanRekap } from "@/server/queries/arisan";
import { getAdminProfile } from "@/lib/session";
import { getPeriodes } from "@/server/queries/periode";

export const dynamic = "force-dynamic";

function first(v) {
  return Array.isArray(v) ? v[0] : v;
}

const fallback = {
  meta: {
    year: new Date().getFullYear(),
    nominalPerEventFormatted: "Rp 0",
    periodeId: null,
    nominal: 0,
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
  periodeId: null,
};

export default async function Page({ searchParams }) {
  const profile = await getAdminProfile();
  const isLoggedIn = !!profile;

  const sp = await searchParams;

  const page = sp?.page ? Number(first(sp.page)) : 1;
  const q = sp?.q ? String(first(sp.q)) : "";
  const rt = sp?.rt ? String(first(sp.rt)) : undefined;
  const from = sp?.from ? String(first(sp.from)) : undefined;
  const to = sp?.to ? String(first(sp.to)) : undefined;
  const min = sp?.min ? Number(first(sp.min)) : undefined;
  const max = sp?.max ? Number(first(sp.max)) : undefined;
  const periodeIdFromUrl = sp?.periode_id
    ? Number(first(sp.periode_id))
    : undefined;

  let initial = fallback;
  try {
    initial = await getArisanRekap({
      page,
      q,
      rt,
      from,
      to,
      min,
      max,
      periode_id: periodeIdFromUrl,
    });
  } catch {
    initial = fallback;
  }

  let periodes = [];
  try {
    const periodeResp = await getPeriodes().catch(() => null);
    periodes = Array.isArray(periodeResp?.data) ? periodeResp.data : [];
  } catch {
    periodes = [];
  }
  const activePeriodeId =
    periodeIdFromUrl ?? initial.periodeId ?? periodes[0]?.id ?? null;

  initial = {
    ...initial,
    periodes,
    periodeId: activePeriodeId,
  };

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
        <ArisanRekapClient initial={initial} readOnly={!isLoggedIn} />
      </div>
    </div>
  );
}
