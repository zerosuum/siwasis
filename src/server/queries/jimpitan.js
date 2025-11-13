import { proxyJSON } from "./_api";

export async function getJimpitanLaporan(
  _tokenIgnored,
  { page, year, from, to, q, type, min, max } = {}
) {
  return proxyJSON("/jimpitan/laporan", {
    params: { page, year, from, to, q, type, min, max, per_page: 15 },
  });
}
