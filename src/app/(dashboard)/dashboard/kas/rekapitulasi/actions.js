"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { saveKasRekap } from "@/server/queries/kas";
import { API_BASE } from "@/lib/config";

export async function actionSaveRekap(payload) {
  const res = await saveKasRekap(payload);
  revalidatePath("/dashboard/kas/rekapitulasi");
  revalidatePath("/dashboard/kas/laporan"); 
  return res;
}

export async function actionCreatePeriod(payload) {
  const res = await fetch(`${API_BASE}/kas/periode/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name: payload.name,
      nominal: Number(payload.nominal || 0),
      from: payload.from, // "YYYY-MM-DD"
      to: payload.to, // "YYYY-MM-DD"
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Create period failed: ${res.status} ${txt}`);
  }

  const json = await res.json().catch(() => ({}));
  const newYear =
    json?.year ??
    json?.period?.year ??
    (() => {
      const m = String(payload.name || "").match(/\b(20\d{2})\b/);
      return m ? Number(m[1]) : new Date().getFullYear();
    })();

  revalidatePath("/dashboard/kas/rekapitulasi");
  return { ok: true, year: Number(newYear) };
}
