const API = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000/api";

export async function getKasRekap({
  page = 1,
  year,
  search,
  rt,
  from,
  to,
  min,
  max,
}) {
  const p = new URLSearchParams();
  p.set("page", String(page));
  if (year) p.set("year", String(year));
  if (search) p.set("q", search);
  if (rt) p.set("rt", rt);
  if (from) p.set("from", from);
  if (to) p.set("to", to);
  if (Number.isFinite(min)) p.set("min", String(min));
  if (Number.isFinite(max)) p.set("max", String(max));
  const url = `${API}/kas/rekap?${p}`;

  const res = await fetch(url, { cache: "no-store" });
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error(`GET ${url} -> ${res.status}`);
      return { ok: false };
    }
    return res.json();
  } catch (e) {
    console.error("fetch rekap failed:", e);
    return { ok: false };
  }
}

export async function getKasLaporan({ page = 1, year, from, to, q, type, min, max }) {
  const p = new URLSearchParams();
  p.set("page", String(page));
  if (year) p.set("year", String(year));
  if (from) p.set("from", from);
  if (to) p.set("to", to);
  if (q) p.set("q", q);
  if (type) p.set("type", type); // 'IN' | 'OUT'
  if (Number.isFinite(min)) p.set("min", String(min));
  if (Number.isFinite(max)) p.set("max", String(max));

  const url = `${API}/kas/laporan?${p}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error(`GET ${url} -> ${res.status}`);
      return { ok: false };
    }
    return res.json();
  } catch (e) {
    console.error("fetch rekap failed:", e);
    return { ok: false };
  }
}
