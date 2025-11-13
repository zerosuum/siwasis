import KPICard from "@/components/KPICard";
import { getDashboardSummary } from "@/server/queries/dashboard";
import { toRp } from "@/lib/format";
import DashboardChartWrapper from "./DashboardChartWrapper";
import DashboardHeaderControls from "./DashboardHeaderControls";
import DashboardSyncRow from "./DashboardSyncRow";
import { getAdminProfile } from "@/lib/session";


export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }) {
  const profile = await getAdminProfile();
  const isLoggedIn = !!profile;

  const sp = await searchParams;
  const from = sp?.from || null;
  const to = sp?.to || null;

  let data = {
    kpi: { pemasukan: 0, pengeluaran: 0, saldo: 0 },
    chart: [],
    arisan: [],
    kasTable: [],
    period: { from: null, to: null },
  };
  try {
    data = await getDashboardSummary({ from, to });
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
  const isSudahDapat = (status) =>
    String(status || "")
      .toLowerCase()
      .includes("sudah");

  return (
    <div className="pb-10 space-y-4">
      <div className="grid grid-cols-[1fr_auto] items-center gap-4">
        <h2 className="text-lg md:text-xl font-semibold text-[#46552D]">
          Ringkasan aktivitas keuangan WASIS
        </h2>
        <div className="flex-shrink-0">
          <DashboardHeaderControls isLoggedIn={isLoggedIn} />
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

      <div className="rounded-2xl bg-white border border-[#EEF0E8] shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <table className="min-w-[800px] w-full text-sm table-fixed">
            <thead className="bg-[#F4F6EE] sticky top-0 z-10">
              <tr className="text-left text-gray-600">
                <th className="py-3 px-3 w-[60px]">No</th>
                <th className="py-3 px-3 w-[80px] text-center">RT</th>
                <th className="py-3 px-3">Nama</th>
                <th className="py-3 px-3 text-center">Jumlah Setoran</th>
                <th className="py-3 px-3 text-right">Total Kas</th>
              </tr>
            </thead>
            <tbody>
              {data.kasTable.slice(0, 5).map((r, i) => (
                <tr key={r.id} className={i % 2 ? "bg-[#FAFBF7]" : "bg-white"}>
                  <td className="py-3 px-3 text-gray-500">
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td className="py-3 px-3 text-center">{r.rt ?? "—"}</td>
                  <td className="py-3 px-3">{r.nama}</td>
                  <td className="py-3 px-3 text-center tabular-nums">
                    {r.jumlah_setoran}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums font-medium">
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
