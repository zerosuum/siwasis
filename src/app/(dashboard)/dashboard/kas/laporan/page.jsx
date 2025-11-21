import { getKasLaporan } from "@/server/queries/kas";
import LaporanClient from "./LaporanClient";
import KPICard from "@/components/KPICard";
import { first } from "@/lib/utils";
import { getAdminProfile } from "@/lib/session";
import { getPeriodes } from "@/server/queries/periode";

export const dynamic = "force-dynamic";

const defaultData = {
  meta: {
    year: new Date().getFullYear(),
  },
  rows: [],
  total: 0,
  page: 1,
  perPage: 10,
  kpi: {
    pemasukanFormatted: "Rp 0",
    pengeluaranFormatted: "Rp 0",
    saldoFormatted: "Rp 0",
    rangeLabel: "Tidak ada data",
  },
};

function formatRp(n) {
  return Number(n ?? 0).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
}

function normalizeKasLaporan(resp, year) {
  if (!resp || resp.ok === false) {
    return {
      ...defaultData,
      meta: { year: year || defaultData.meta.year },
    };
  }

  const pag = resp.pagination || {};
  const raw = resp.data || resp.rows || [];

  const rows = raw.map((r) => ({
    id: r.id,
    tanggal: r.tanggal,
    keterangan: r.keterangan,
    pemasukan: r.tipe === "pemasukan" ? Number(r.jumlah) : 0,
    pengeluaran: r.tipe === "pengeluaran" ? Number(r.jumlah) : 0,
    saldo: r.saldo_sementara ?? 0,
  }));

  const totalMasuk = rows.reduce((a, b) => a + (b.pemasukan || 0), 0);
  const totalKeluar = rows.reduce((a, b) => a + (b.pengeluaran || 0), 0);
  const saldo = totalMasuk - totalKeluar;

  const filterYear = resp.filter?.year ?? year ?? null;

  return {
    meta: {
      year: filterYear || new Date().getFullYear(),
    },
    rows,
    page: pag.current_page ?? 1,
    perPage: pag.per_page ?? 10,
    total: pag.total ?? rows.length,
    kpi: {
      pemasukanFormatted: formatRp(totalMasuk),
      pengeluaranFormatted: formatRp(totalKeluar),
      saldoFormatted: formatRp(saldo),
      rangeLabel: filterYear ? `Tahun ${filterYear}` : "Semua",
    },
  };
}

export default async function Page({ searchParams }) {
  const profile = await getAdminProfile();
  const isLoggedIn = !!profile;

  const sp = await searchParams;

  const periodeResp = await getPeriodes();
  const periodes = Array.isArray(periodeResp?.data) ? periodeResp.data : [];

  const yearFromPeriode =
    periodes.length && periodes[0]?.tanggal_mulai
      ? new Date(periodes[0].tanggal_mulai).getFullYear()
      : new Date().getFullYear();

  const page = sp?.page ? Number(first(sp.page)) : 1;
  const year = sp?.year ? Number(first(sp.year)) : yearFromPeriode;
  const from = sp?.from ? String(first(sp.from)) : null;
  const to = sp?.to ? String(first(sp.to)) : null;
  const q = sp?.q ? String(first(sp.q)) : "";
  const type = sp?.type ? String(first(sp.type)) : null;
  const min = sp?.min ? Number(first(sp.min)) : undefined;
  const max = sp?.max ? Number(first(sp.max)) : undefined;
  const rt = sp?.rt ? String(first(sp.rt)) : "all";

  let initial = { ...defaultData, meta: { year } };

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
    initial = normalizeKasLaporan(resp, year);
  } catch {
    initial = { ...defaultData, meta: { year } };
  }
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
    
      <LaporanClient initial={initial} readOnly={!isLoggedIn} />
    </div>
  );
}
