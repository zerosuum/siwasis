// src/server/actions/kas.js  (Next.js)
import { API_BASE } from "@/lib/config";

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { Accept: "application/json" },
    body,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${url} failed: ${res.status} ${text}`);
  }
  return res.json();
}

// === Rekap
export async function saveKasRekap(formData) {
  // formData: FormData yang berisi key 'payload'
  return postJSON(`${API_BASE}/kas/rekap/save`, formData);
}

// === Laporan
export async function createKasEntry(payload) {
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => fd.append(k, String(v ?? "")));
  return postJSON(`${API_BASE}/kas/laporan/create`, fd);
}

export async function updateKasEntry(payload) {
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => fd.append(k, String(v ?? "")));
  return postJSON(`${API_BASE}/kas/laporan/update`, fd);
}

export async function deleteKasEntry(id) {
  const fd = new FormData();
  fd.append("id", String(id));
  return postJSON(`${API_BASE}/kas/laporan/delete`, fd);
}
