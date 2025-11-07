const RAW_API =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.API_BASE ||
  "http://127.0.0.1:8000/api";

const ORIGIN =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000"
    : window.location.origin;

export const API_BASE = RAW_API.replace(/\/+$/, "");

export function makeURL(path) {
  if (/^https?:\/\//i.test(path)) return new URL(path);
  return new URL(path, ORIGIN);
}

export function setParams(url, params = {}) {
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  }
  return url;
}

export async function fetchData(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.rows || data;
  } catch {
    return [];
  }
}
