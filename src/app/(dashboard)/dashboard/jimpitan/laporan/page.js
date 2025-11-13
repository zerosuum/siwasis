import KPICard from "@/components/KPICard";
import JimpitanClient from "./JimpitanClient";
import { getJimpitanLaporan } from "@/server/queries/jimpitan";
import { getAdminProfile } from "@/lib/session";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const defaultData = {
  data: [],
  saldo_akhir_total: 0,
};

export default async function Page({ searchParams }) {
  const profile = await getAdminProfile();
  const isLoggedIn = !!profile;

  const cookieStore = await cookies();
  const token = cookieStore.get("siwasis_token")?.value || null;

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
  let kpiSaldo = 0;

  try {
    const resp = await getJimpitanLaporan(token, {
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
    console.error("Gagal getJimpitanLaporan:", e.message);
    initial = defaultData;
  }

  const kpiData = initial.data?.data || [];
  const pemasukan = kpiData
    .filter((t) => t.tipe === "pemasukan")
    .reduce((acc, t) => acc + Number(t.jumlah), 0);
  const pengeluaran = kpiData
    .filter((t) => t.tipe === "pengeluaran")
    .reduce((acc, t) => acc + Number(t.jumlah), 0);
  const formatRp = (n) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);

  const kpis = [
    {
      label: "Pemasukan (Halaman Ini)",
      value: formatRp(pemasukan),
      range: `Halaman ${initial.data?.current_page || 1}`,
    },
    {
      label: "Pengeluaran (Halaman Ini)",
      value: formatRp(pengeluaran),
      range: `Halaman ${initial.data?.current_page || 1}`,
    },
    {
      label: "Saldo Total",
      value: formatRp(kpiSaldo),
      range: "Semua Transaksi",
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
