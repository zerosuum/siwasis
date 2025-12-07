import { proxyJSON } from "./_api";

export async function getSampahLaporan(
  _tokenIgnored,
  { page, periodeId, from, to, q, type, min, max } = {}
) {
  const params = {};

  if (page) params.page = page;
  params.per_page = 15;

  if (periodeId) params.periode_id = periodeId;
  if (from) params.from = from;
  if (to) params.to = to;

  if (q) params.q = q;

  if (type === "IN") params.tipe = "pemasukan";
  else if (type === "OUT") params.tipe = "pengeluaran";

  if (min != null) params.min = min;
  if (max != null) params.max = max;

  const raw = await proxyJSON("/sampah/laporan", { params });

  const rows = raw.data ?? [];

  const paginated = {
    data: rows,
    current_page: raw.pagination?.current_page ?? 1,
    per_page: raw.pagination?.per_page ?? (rows.length || 15),
    total: raw.pagination?.total ?? rows.length ?? 0,
  };

  return {
    saldo_akhir_total: raw.saldo_akhir_total ?? 0,
    saldo_filter: raw.saldo_filter ?? 0,
    data: paginated,
    filters: raw.filters ?? {},
  };
}
