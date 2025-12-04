import KPICard from "@/components/KPICard";
import SampahClient from "./SampahClient";
import { getSampahLaporan } from "@/server/queries/sampah";
import { getAdminProfile } from "@/lib/session";
import { cookies } from "next/headers";
import { getPeriodes } from "@/server/queries/periode";

export const dynamic = "force-dynamic";

const defaultData = {
  saldo_akhir_total: 0,
  data: {
    data: [],
    current_page: 1,
    per_page: 15,
    total: 0,
  },
};
const FALLBACK_YEAR = new Date().getFullYear();

export default async function Page({ searchParams }) {
  const sp = (await searchParams) || {};

  const profile = await getAdminProfile();
  const isLoggedIn = !!profile;

  const cookieStore = await cookies();
  const token = cookieStore.get("siwasis_token")?.value || null;

  let periodes = [];
  try {
    const rawPeriodes = await getPeriodes();

    const list = Array.isArray(rawPeriodes?.data) ? rawPeriodes.data : [];

    periodes = list.map((p) => {
      const tahun = p.tanggal_mulai
        ? new Date(p.tanggal_mulai).getFullYear()
        : p.tanggal_selesai
        ? new Date(p.tanggal_selesai).getFullYear()
        : null;

      return {
        id: p.id,
        nama: p.nama ?? `Periode ${tahun ?? ""}`.trim(),
        tahun,
      };
    });
  } catch (e) {
    console.error("Gagal getPeriodes:", e.message);
    periodes = [];
  }

  const tahunSet = new Set(
    periodes
      .map((p) => p.tahun)
      .filter((t) => typeof t === "number" || typeof t === "string")
  );
  const tahunList = Array.from(tahunSet)
    .map((t) => Number(t))
    .filter((t) => !Number.isNaN(t))
    .sort((a, b) => b - a);
    
  const spYear = sp.year ? Number(sp.year) : null;
  const year =
    spYear && !Number.isNaN(spYear)
      ? spYear
      : tahunList[0] ?? new Date().getFullYear();

  const page = sp.page ? Number(sp.page) : 1;
  const from = sp.from ?? null;
  const to = sp.to ?? null;
  const q = sp.q ?? "";
  const type = sp.tipe ?? sp.type ?? null;
  const min = sp.min ? Number(sp.min) : undefined;
  const max = sp.max ? Number(sp.max) : undefined;

  let initial = defaultData;
  let kpiSaldo = 0;

  try {
    const resp = await getSampahLaporan(token, {
      page,
      year,
      from,
      to,
      q,
      type,
      min,
      max,
    });
    initial = resp || defaultData;

    kpiSaldo =
      (resp.saldo_filter ?? null) !== null
        ? resp.saldo_filter
        : resp.saldo_akhir_total ?? 0;
  } catch (e) {
    console.error("Gagal getSampahLaporan:", e.message);
  }

  const rawData = initial.data ?? [];
  const kpiData = Array.isArray(rawData) ? rawData : rawData.data || [];

  const pemasukan = kpiData
    .filter((t) => t.tipe === "pemasukan")
    .reduce((acc, t) => acc + Number(t.jumlah || 0), 0);

  const pengeluaran = kpiData
    .filter((t) => t.tipe === "pengeluaran")
    .reduce((acc, t) => acc + Number(t.jumlah || 0), 0);

  const formatRp = (n) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);

  const kpis = [
    {
      label: "Pemasukan Sampah",
      value: formatRp(pemasukan),
      range: `Halaman ${initial.data?.current_page || 1}`,
    },
    {
      label: "Pengeluaran Sampah",
      value: formatRp(pengeluaran),
      range: `Halaman ${initial.data?.current_page || 1}`,
    },
    {
      label: "Saldo Periode",
      value: formatRp(kpiSaldo),
      range: `Tahun ${year}`,
    },
  ];

  // console.log(
  //   "Sampah Laporan initial from API:",
  //   JSON.stringify(initial, null, 2)
  // );

  return (
    <div className="pb-10">
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {kpis.map((k) => (
          <KPICard key={k.label} {...k} />
        ))}
      </div>
      <SampahClient initial={initial} readOnly={!isLoggedIn} years={tahunList} activeYear={year} />
    </div>
  );
}