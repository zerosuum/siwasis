import { getPeriodes } from "@/server/queries/periode";
import { getArisanRekap } from "@/server/queries/arisan";
import RekapClient from "./RekapClient";
import KPICard from "@/components/KPICard";
import { first } from "@/lib/utils";
import { getAdminProfile } from "@/lib/session";

export const dynamic = "force-dynamic";

const fallback = {
  meta: {
    nominal: 0,
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
  const periodes = Array.isArray(periodeResp?.data) ? periodeResp.data : [];

  let activePeriode =
    periodes.find((p) => p.id === periodeIdFromUrl) ||
    periodes.find((p) => p.is_active) ||
    periodes[0] ||
    null;

  const periodeId = activePeriode?.id ?? null;

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
      periode_id: periodeId,
    });
  } catch (err) {
    initial = fallback;
  }

  initial.periodeId = periodeId;
  initial.periodes = periodes;

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
