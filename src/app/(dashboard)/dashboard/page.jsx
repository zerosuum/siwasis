import KPICard from "@/components/KPICard";
import { getDashboardSummary } from "@/server/queries/dashboard";
import { toRp } from "@/lib/format";
import DashboardHeaderControls from "./DashboardHeaderControls";
import DashboardSyncRow from "./DashboardSyncRow";
import { getAdminProfile } from "@/lib/session";
import { getPeriodes } from "@/server/queries/periode";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }) {
  const profile = await getAdminProfile();
  const isLoggedIn = !!profile;

  const sp = searchParams ?? {};

  const urlFrom = sp.from ?? null;
  const urlTo = sp.to ?? null;

  let periodes = [];
  let defaultFrom = null;
  let defaultTo = null;
  let periodeId = sp.periode ? Number(sp.periode) : null;

  try {
    const periodeResp = await getPeriodes().catch(() => null);
    periodes = Array.isArray(periodeResp?.data) ? periodeResp.data : [];

    const activePeriode = periodeId
      ? periodes.find((p) => p.id === periodeId)
      : periodes[0];

    if (activePeriode) {
      defaultFrom = activePeriode.tanggal_mulai ?? null;
      defaultTo = activePeriode.tanggal_selesai ?? null;

      if (!periodeId) {
        periodeId = activePeriode.id;
      }
    }
  } catch {
    periodes = [];
  }

  const from = urlFrom || defaultFrom;
  const to = urlTo || defaultTo;

  let data = {
    kpi: { pemasukan: 0, pengeluaran: 0, saldo: 0 },
    chart: [],
    arisan: [],
    kasTable: [],
    period: { from: null, to: null, nama: null },
  };

  try {
    data = await getDashboardSummary({ from, to, periode: periodeId });
  } catch {}

  const periodStr =
    data?.period?.from && data?.period?.to
      ? `${new Date(data.period.from).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })} – ${new Date(data.period.to).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}`
      : "—";

  return (
    <div className="pb-10 space-y-4">
      <div className="grid grid-cols-[1fr_auto] items-center gap-4">
        <h2 className="text-lg md:text-xl font-semibold text-[#46552D]">
          Ringkasan aktivitas keuangan WASIS
        </h2>
        <div className="flex-shrink-0">
          <DashboardHeaderControls
            isLoggedIn={isLoggedIn}
            periodes={periodes}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KPICard
          label="Pemasukan"
          value={toRp(data.kpi.pemasukan)}
          range={periodStr}
        />
        <KPICard
          label="Pengeluaran"
          value={toRp(data.kpi.pengeluaran)}
          range={periodStr}
        />
        <KPICard label="Saldo" value={toRp(data.kpi.saldo)} range={periodStr} />
      </div>

      <DashboardSyncRow chartData={data.chart} arisan={data.arisan} />

      {/* Tabel kas warga */}
      <div className="rounded-2xl bg-white border border-[#EEF0E8] shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <table className="min-w-[840px] w-full text-sm table-fixed">
            <thead className="bg-[#F4F6EE] sticky top-0 z-10">
              <tr className="text-left text-gray-600">
                <th className="py-3 px-4 w-[64px] text-center">No</th>
                <th className="py-3 px-3 w-[80px] text-center">RT</th>
                <th className="py-3 px-3">Nama</th>
                <th className="py-3 px-3 text-center">Jumlah Setoran</th>
                <th className="py-3 px-4 text-right">Total Kas</th>
              </tr>
            </thead>
            <tbody>
              {data.kasTable.slice(0, 5).map((r, i) => (
                <tr key={r.id} className={i % 2 ? "bg-[#FAFBF7]" : "bg-white"}>
                  <td className="py-3 px-4 text-center text-gray-500">
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td className="py-3 px-3 text-center">{r.rt ?? "—"}</td>
                  <td className="py-3 px-3">{r.nama}</td>
                  <td className="py-3 px-3 text-center tabular-nums whitespace-nowrap">
                    {r.jumlah_setoran}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums font-medium whitespace-nowrap">
                    {toRp(r.total_kas)}
                  </td>
                </tr>
              ))}
              {!data.kasTable?.length && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">
                    Tidak ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}