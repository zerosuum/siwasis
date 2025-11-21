import KPICard from "@/components/KPICard";
import SampahClient from "./SampahClient";
import { getSampahLaporan } from "@/server/queries/sampah";
import { getAdminProfile } from "@/lib/session";
import { cookies } from "next/headers";

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

export default async function Page({ searchParams }) {
  const sp = (await searchParams) || {};

  const profile = await getAdminProfile();
  const isLoggedIn = !!profile;

  const cookieStore = await cookies();
  const token = cookieStore.get("siwasis_token")?.value || null;

  const page = sp.page ? Number(sp.page) : 1;
  const year = sp.year ? Number(sp.year) : new Date().getFullYear();
  const from = sp.from ?? null;
  const to = sp.to ?? null;
  const q = sp.q ?? ""; // ✅ BACA q dari URL
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
    kpiSaldo = resp.saldo_akhir_total || 0;
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

  const formatRpCompact = (n) => {
    const abs = Math.abs(n);

    if (abs >= 1_000_000_000) {
      return `Rp ${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
    }
    if (abs >= 1_000_000) {
      return `Rp ${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (abs >= 1_000) {
      return `Rp ${Math.round(n / 1000)}k`;
    }
    return formatRp(n);
  };

  const kpis = [
    {
      label: "Pemasukan Sampah",
      value: formatRpCompact(pemasukan),
      range: `Halaman ${initial.data?.current_page || 1}`,
    },
    {
      label: "Pengeluaran Sampah",
      value: formatRpCompact(pengeluaran),
      range: `Halaman ${initial.data?.current_page || 1}`,
    },
    {
      label: "Saldo Total",
      value: formatRpCompact(kpiSaldo),
      range: "Semua Transaksi",
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
      <SampahClient initial={initial} readOnly={!isLoggedIn} />
    </div>
  );
}