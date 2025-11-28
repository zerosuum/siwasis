import { proxyJSON } from "./_api";

export async function getDashboardSummary({ from, to, periode } = {}) {
  const json = await proxyJSON("/dashboard/summary", {
    params: {
      from,
      to,
      periode_id: periode,
    },
  });

  const periodeMeta = json.periode || {};
  const d = json.data || {};
  const kasTotal = d.kas_total || {};

  const chart = (d.chart_keuangan || []).map((row) => ({
    label: row.bulan,
    Pemasukan: Number(row.total_pemasukan || 0),
    Pengeluaran: Number(row.total_pengeluaran || 0),
  }));

  const kasTable = (d.rekap_kas_warga || []).map((row) => ({
    id: row.id,
    rt: row.rt,
    nama: row.nama,
    jumlah_setoran: row.jumlah_setoran ?? 0,
    total_kas: row.total_setoran ?? 0,
  }));

  const arisan = (d.status_arisan || []).map((item, idx) => ({
    id: item.warga_id || idx,
    nama: item.nama || "-",
    status: item.status_arisan || "-",
  }));

  return {
    kpi: {
      pemasukan: Number(
        kasTotal.total_pemasukan_semua ??
          kasTotal.pemasukan ?? 
          0
      ),

      pengeluaran: Number(
        kasTotal.total_pengeluaran_semua ?? kasTotal.pengeluaran ?? 0
      ),

      saldo: Number(kasTotal.saldo_akhir_semua ?? kasTotal.saldo ?? 0),

      pemasukan_arisan: Number(kasTotal.pemasukan_arisan ?? 0),
    },
    chart,
    arisan,
    kasTable,
    period: {
      from: periodeMeta.from || null,
      to: periodeMeta.to || null,
      nama: periodeMeta.nama || null,
    },
  };
}
