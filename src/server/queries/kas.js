const RAW_API =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.API_BASE ||
  "http://127.0.0.1:8000/api";

const API_BASE = RAW_API.replace(/\/+$/, "");

function setParams(url, params = {}) {
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  }
  return url;
}

export async function getKasRekap({
  page,
  year,
  q,
  rt,
  from,
  to,
  min,
  max,
} = {}) {

  const url = new URL(`${API_BASE}/kas/rekap`);
  setParams(url, { page, year, q, rt, from, to, min, max });

  try {
    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error("getKasRekap fetch failed:", {
      url: url.toString(),
      message: err?.message,
    });
    throw err;
  }
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
} = {}) {
  const url = new URL(`${API_BASE}/kas/laporan`);
  setParams(url, { page, year, from, to, q, type, min, max });

  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.json();
}

export async function saveKasRekap(formData) {
  const url = `${API_BASE}/kas/rekap/save`;
  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.json();
}
