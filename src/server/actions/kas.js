// src/server/actions/kas.js
"use server";

import "server-only";

/**
 * Simpan rekap kas ke backend.
 * payload: { year, from, to, updates }
 */
export async function saveKasRekap(payload) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = `${base}/api/mock/kas/rekap`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`saveKasRekap failed: ${res.status}`);
  }

  return res.json();
}
x