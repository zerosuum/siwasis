import { proxyJSON } from "./_api";

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

  if (periodeId) {
    params.periode_id = periodeId;
  }

  if (q) params.q = q;

  if (rt && rt !== "all") params.rt = rt;

  if (from && to) {
    params.from = from;
    params.to = to;
  }

  if (typeof min === "number") params.min = min;
  if (typeof max === "number") params.max = max;

  if (noPaginate) params.no_paginate = true;

  return proxyJSON("/kas/rekap", { params });
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
  perPage,
} = {}) {
  const params = {};

  if (typeof page !== "undefined") params.page = page;
  if (typeof perPage !== "undefined") params.per_page = perPage;

  if (year) params.year = year;

  if (from && to) {
    params.from = from;
    params.to = to;
  }

  if (q) params.q = q;
  if (typeof min === "number") params.min = min;
  if (typeof max === "number") params.max = max;

  if (type === "IN") params.tipe = "pemasukan";
  else if (type === "OUT") params.tipe = "pengeluaran";

  return proxyJSON("/kas/laporan", { params });
}

export async function saveKasRekap({ periodeId, updates } = {}) {
  const body = {
    periode_id: periodeId,
    updates: (updates || []).map((u) => ({
      warga_id: u.wargaId,
      tanggal: u.tanggal,
      status: u.status ?? (u.checked ? "sudah_bayar" : "belum_bayar"),
      jumlah:
        typeof u.jumlah === "number"
          ? u.jumlah
          : u.checked
          ? 0 
          : 0,
    })),
  };

  return proxyJSON("/kas/rekap/save", {
    method: "POST",
    json: body,
  });
}