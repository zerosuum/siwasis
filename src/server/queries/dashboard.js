const RAW_API =
  process.env.NEXT_PUBLIC_API_BASE || process.env.API_BASE || "/api";
const ORIGIN =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_ORIGIN ||
      "http://localhost:3000"
    : window.location.origin;
const API_BASE = RAW_API.replace(/\/+$/, "");
const makeURL = (p) => new URL(/^https?:\/\//.test(p) ? p : p, ORIGIN);

export async function getDashboardSummary({ from, to } = {}) {
  const url = makeURL(`${API_BASE}/dashboard/summary`);
  if (from) url.searchParams.set("from", from);
  if (to) url.searchParams.set("to", to);
  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
export { API_BASE };
