import { proxyJSON } from "./_api";
import { toRp } from "@/lib/format";

export async function getKasRekap({
  page,
  perPage,
  periodeId,
  q,
  rt,
  from,
  to,
  min,
  max,
  noPaginate,
} = {}) {
  const params = {};

  if (typeof page !== "undefined") params.page = page;
  if (typeof perPage !== "undefined") params.per_page = perPage;
  if (periodeId) params.periode_id = periodeId;
  if (q) params.q = q;
  if (rt && rt !== "all") params.rt = rt;
  if (from && to) {
    params.from = from;
    params.to = to;
  }
  if (typeof min === "number") params.min = min;
  if (typeof max === "number") params.max = max;
  if (noPaginate) params.no_paginate = true;

  const json = await proxyJSON("/kas/rekap", { params });

  const dates = Array.isArray(json.dates) ? json.dates : [];
  const paginator = json.data || {};
  const rawRows = Array.isArray(paginator.data) ? paginator.data : [];

  const listRt = Array.isArray(json.list_rt) ? json.list_rt : [];

  let nominal = Number(json.nominal_kas ?? json.nominal ?? 0);

  if (!nominal) {
    for (const row of rawRows) {
      const payments = row.payment_status || {};
      for (const info of Object.values(payments)) {
        const j = Number(info?.jumlah ?? 0);
        if (j > 0) {
          nominal = j;
          break;
        }
      }
      if (nominal) break;
    }
  }

  const rows = rawRows.map((row) => {
    const payments = row.payment_status || {};
    const kehadiran = {};
    let jumlahSetoran = 0;
    let totalSetoran = 0;

    for (const d of dates) {
      const info = payments[d];

      if (info?.status === "sudah_bayar") {
        kehadiran[d] = true;
        jumlahSetoran += 1;

        let jml = Number(info.jumlah);
        if (!Number.isFinite(jml) || jml <= 0) {
          jml = nominal || 0;
        }
        totalSetoran += jml;
      }
    }

    return {
      id: row.warga_id ?? row.id,
      nama: row.nama,
      rt: row.rt,
      jumlahSetoran,
      totalSetoran,
      totalSetoranFormatted: toRp(totalSetoran),
      kehadiran,
    };
  });

  const totalMasuk = rows.reduce(
    (sum, r) => sum + (Number(r.totalSetoran) || 0),
    0
  );
  const totalKeluar = 0;
  const saldo = totalMasuk - totalKeluar;

  const filters = json.filters || {};
  const usedPeriodeId =
    periodeId ?? (filters.periode_id ? Number(filters.periode_id) : null);

  const year = filters.year ? Number(filters.year) : new Date().getFullYear();

  return {
    rows,
    dates,
    page: paginator.current_page ?? 1,
    perPage: paginator.per_page ?? 10,
    total: paginator.total ?? rows.length,
    meta: {
      year,
      nominal,
      nominalFormatted: toRp(nominal),
      periodeId: usedPeriodeId,
    },
    kpi: {
      pemasukanFormatted: toRp(totalMasuk),
      pengeluaranFormatted: toRp(totalKeluar),
      saldoFormatted: toRp(saldo),
      rangeLabel: json.periode || `Tahun ${year}`,
    },
    listRt,
  };
}

export async function saveKasRekap({ periodeId, updates } = {}) {
  const body = {
    periode_id: periodeId,
    updates: (updates || []).map((u) => ({
      warga_id: u.wargaId,
      tanggal: u.tanggal,
      status: u.status ?? (u.checked ? "sudah_bayar" : "belum_bayar"),
      jumlah: u.jumlah ?? 0,
    })),
  };

  return proxyJSON("/kas/rekap/save", {
    method: "POST",
    json: body,
  });
}

export async function getKasLaporan({
  page,
  year,
  from,
  to,
  q,
  type,
  min,
  max,
  periodeId,
} = {}) {
  const params = {};

  if (typeof page !== "undefined") params.page = page;

  if (!periodeId && typeof year !== "undefined" && year !== null) {
    params.year = year;
  }

  if (periodeId) {
    params.periode_id = periodeId;
  }

  if (from && to) {
    params.from = from;
    params.to = to;
  }

  if (q) params.q = q;

  if (type === "IN") params.tipe = "pemasukan";
  else if (type === "OUT") params.tipe = "pengeluaran";

  if (typeof min === "number") params.min = min;
  if (typeof max === "number") params.max = max;

  const json = await proxyJSON("/kas/laporan", { params });
  return json;
}
