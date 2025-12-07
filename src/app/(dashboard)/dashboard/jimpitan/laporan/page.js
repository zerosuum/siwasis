import KPICard from "@/components/KPICard";
import JimpitanClient from "./JimpitanClient";
import { getJimpitanLaporan } from "@/server/queries/jimpitan";
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

export default async function Page({ searchParams }) {
  const sp = (await searchParams) || {};

  const profile = await getAdminProfile();
  const isLoggedIn = !!profile;

  const cookieStore = await cookies();
  const token = cookieStore.get("siwasis_token")?.value || null;

  let periodes = [];
  try {
    const raw = await getPeriodes(token);
    const list = Array.isArray(raw?.data) ? raw.data : [];

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

  const spPeriodeId = sp.periode_id ? Number(sp.periode_id) : null;
  const defaultPeriode = periodes[0] || null;
  const activePeriode =
    (spPeriodeId && periodes.find((p) => p.id === spPeriodeId)) ||
    defaultPeriode;

  const activePeriodeId = activePeriode?.id || null;

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
    const resp = await getJimpitanLaporan(token, {
      page,
      periodeId: activePeriodeId,
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
    console.error("Gagal getJimpitanLaporan:", e.message);
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
      label: "Pemasukan Jimpitan",
      value: formatRp(pemasukan),
      range: `Halaman ${initial.data?.current_page || 1}`,
    },
    {
      label: "Pengeluaran Jimpitan",
      value: formatRp(pengeluaran),
      range: `Halaman ${initial.data?.current_page || 1}`,
    },
    {
      label: "Saldo Periode",
      value: formatRp(kpiSaldo),
      range: activePeriode ? activePeriode.nama : "Semua Periode",
    },
  ];

  return (
    <div className="pb-10">
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {kpis.map((k) => (
          <KPICard key={k.label} {...k} />
        ))}
      </div>

      <JimpitanClient
        initial={initial}
        readOnly={!isLoggedIn}
        periodes={periodes}
        activePeriodeId={activePeriodeId}
      />
    </div>
  );
}
