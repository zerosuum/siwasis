"use server";
import "server-only";
import { API_BASE } from "@/lib/config";

async function json(res) {
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const t = await res.text().catch(() => "");
    throw new Error(`Bad response: ${res.status} ${t}`);
  }
  const data = await res.json();
  if (data?.ok === false) throw new Error(data?.message || "Request failed");
  return data;
}

export async function createSampahEntry(payload) {
  const res = await fetch(`${API_BASE}/sampah/laporan`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  return json(res);
}

export async function updateSampahEntry(payload) {
  const { id, ...rest } = payload;
  const res = await fetch(`${API_BASE}/sampah/laporan/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(rest),
    credentials: "include",
  });
  return json(res);
}

export async function deleteSampahEntry(id) {
  const res = await fetch(`${API_BASE}/sampah/laporan/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
    credentials: "include",
  });
  return json(res);
}
