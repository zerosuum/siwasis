import { API_BASE, makeURL, setParams } from "./_api";

export async function getDocuments({ page, search, from, to, perPage } = {}) {
  const url = makeURL(`${API_BASE}/documents`);
  setParams(url, { page, q: search, from, to, limit: perPage });

  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.json();
}
