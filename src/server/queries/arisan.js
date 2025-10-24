import { API_BASE, makeURL, setParams } from "./_api";
export async function getArisanRekap({
  page,
  year,
  q,
  rt,
  from,
  to,
  min,
  max,
} = {}) {
  const url = new URL(`${API_BASE}/arisan/rekap`);
  setParams(url, { page, year, q, rt, from, to, min, max });
  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.json();
}

export async function getSpinCandidates({ year } = {}) {
  const url = new URL(`${API_BASE}/arisan/spin/candidates`);
  setParams(url, { year });
  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.json();
}

export async function postSpinDraw({ wargaId, tanggal }) {
  const url = `${API_BASE}/arisan/spin/draw`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ wargaId, tanggal }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.json();
}

export async function saveArisanRekap({ year, updates, from, to }) {
  const fd = new FormData();
  fd.append("payload", JSON.stringify({ year, updates, from, to }));

  const res = await fetch(`${API_BASE}/arisan/rekap/save`, {
    method: "POST",
    body: fd,
    headers: { Accept: "application/json" },
  });

  const ct = res.headers.get("content-type") || "";
  if (!res.ok || !ct.includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new Error(`Save failed (${res.status}): ${text || "Bad response"}`);
  }
  const data = await res.json();
  if (!data || (data.ok !== true && data.success !== true)) {
    throw new Error("Save failed (invalid payload)");
  }
  return data;
}
