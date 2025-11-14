import { proxyJSON } from "./_api";

export async function getSampahLaporan(
  _tokenIgnored,
  { page, year, from, to, /* q, */ type, min, max } = {}
) {

  const raw = await proxyJSON("/sampah/laporan", {
    params: { page, year, from, to, type, min, max, per_page: 15 },
  });

  const rows = raw.data ?? [];

  const paginated = {
    data: rows,
    current_page: raw.pagination?.current_page ?? 1,
    per_page: raw.pagination?.per_page ?? rows.length ?? 15,
    total: raw.pagination?.total ?? rows.length ?? 0,
  };

  return {
    saldo_akhir_total: raw.saldo_akhir_total ?? 0,
    data: paginated,
    filters: raw.filters ?? {},
  };
}
