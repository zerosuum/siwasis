import { API_BASE, makeURL, setParams } from "./_api";

export async function getJimpitanLaporan({
  page,
  year,
  from,
  to,
  q,
  type,
  min,
  max,
} = {}) {
  const url = new URL(`${API_BASE}/jimpitan/laporan`);
  setParams(url, { page, year, from, to, q, type, min, max });

  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.json();
}
