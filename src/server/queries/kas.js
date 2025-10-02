// src/server/queries/kas.js

import "server-only";

export async function getKasRekap({ year, from, to, search, rt } = {}) {
  const params = new URLSearchParams();
  if (year) params.set("year", year);
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (search) params.set("q", search);
  if (rt) params.set("rt", rt);

  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = `${base}/api/mock/kas/rekap?${params.toString()}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`getKasRekap failed: ${res.status}`);
  return res.json();
}

export async function getKasLaporan({ page, from, to, q } = {}) {
  const params = new URLSearchParams();
  if (page) params.set("page", page);
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (q) params.set("q", q);

  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  // 👇 FIX: Path diubah ke /api/kas/laporan (tanpa /mock)
  const url = `${base}/api/kas/laporan?${params.toString()}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`getKasLaporan failed: ${res.status}`);
  return res.json();
}
