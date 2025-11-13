import { proxyJSON } from "./_api";

export async function getSampahLaporan(
  _tokenIgnored,
  { page, year, from, to, q, type, min, max } = {}
) {
  return proxyJSON("/sampah/laporan", {
    params: { page, year, from, to, q, type, min, max, per_page: 15 },
  });
}
