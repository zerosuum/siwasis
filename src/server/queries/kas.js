import "server-only";

export async function getKasRekap({ year, from, to, search, rt } = {}) {
  const params = new URLSearchParams();
  if (year) params.set("year", year);
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (search) params.set("q", search);
  if (rt) params.set("rt", rt);

  // Gunakan full URL dari NEXT_PUBLIC_BASE_URL
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = `${base}/api/mock/kas/rekap?${params.toString()}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`getKasRekap failed: ${res.status}`);
  return res.json();
}
