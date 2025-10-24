const RAW_API =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.API_BASE ||
  "http://127.0.0.1:8000/api";

export const API_BASE = RAW_API.replace(/\/+$/, "");

function setParams(url, params = {}) {
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "")
      url.searchParams.set(k, String(v));
  }
  return url;
}

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
