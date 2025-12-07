import { proxyJSON } from "./_api";

export async function getDashboardSummary({ from, to, periode } = {}) {
  const params = {};

  if (from) params.from = from;
  if (to) params.to = to;
  if (periode) params.periode_id = periode;

  const json = await proxyJSON("/dashboard/summary", { params });

  // // DEBUG
  // if (process.env.NODE_ENV !== "production") {
  //   console.log("=== [DashboardSummary] REQUEST ===");
  //   console.log("params:", params);

  //   console.log("=== [DashboardSummary] RAW JSON ===");
  //   console.dir(json, { depth: null });

  //   console.log("=== [DashboardSummary] QUICK CHECK ===");
  //   console.log("periode:", json.periode);
  //   console.log(
  //     "chart_keuangan length:",
  //     json?.data?.chart_keuangan?.length ?? 0
  //   );
  //   console.log(
  //     "status_arisan sample:",
  //     (json?.data?.status_arisan ?? []).slice(0, 5)
  //   );
  //   console.log(
  //     "rekap_kas_warga sample:",
  //     (json?.data?.rekap_kas_warga ?? []).slice(0, 3)
  //   );
  // }

  const periodeInfo = json.periode || {};
  const raw = json.data || {};
  const totals = raw.kas_total || {};

  const chartRaw = raw.chart_keuangan || [];
  const rekapKasRaw = raw.rekap_kas_warga || [];
  const arisanRaw = raw.status_arisan || [];

  return {
    kpi: {
      pemasukan: Number(totals.total_pemasukan_semua ?? 0),
      pengeluaran: Number(totals.total_pengeluaran_semua ?? 0),
      saldo: Number(totals.saldo_akhir_semua ?? 0),
    },

    chart: chartRaw.map((row) => ({
      label: row.bulan,
      Pemasukan: Number(row.total_pemasukan ?? 0),
      Pengeluaran: Number(row.total_pengeluaran ?? 0),
    })),

    arisan: arisanRaw.map((row, idx) => ({
      id: row.id ?? row.warga_id ?? idx + 1,
      nama: row.nama,
      status: row.status_arisan ?? "belum_dapat",
    })),

    kasTable: rekapKasRaw.map((row) => ({
      id: row.id,
      nama: row.nama,
      rt: row.rt,
      jumlah_setoran: Number(row.jumlah_setoran ?? 0),
      total_kas: Number(row.total_setoran ?? 0),
    })),

    period: {
      from: periodeInfo.from ?? null,
      to: periodeInfo.to ?? null,
      nama: periodeInfo.nama ?? null,
    },
  };
}
