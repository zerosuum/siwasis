"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { saveKasRekap } from "@/server/queries/kas";
import { API_BASE } from "@/lib/config";
import { getAdminProfile } from "@/lib/session";
import { cookies } from "next/headers";

const checkAuth = async () => {
  const profile = await getAdminProfile();
  if (!profile) throw new Error("Akses ditolak. Silakan login.");
  return profile;
};

const getAuthToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("siwasis_token")?.value || null;
  if (!token) throw new Error("Token tidak ditemukan. Silakan login kembali.");
  return token;
};

export async function actionSaveRekap(payload) {
  await checkAuth();
  const token = await getAuthToken();

  const res = await saveKasRekap(payload, token);
  revalidatePath("/dashboard/kas/rekapitulasi");
  revalidatePath("/dashboard/kas/laporan");
  return res;
}

export async function actionCreatePeriod(payload) {
  await checkAuth();
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE}/kas/periode/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: payload.name,
      nominal: Number(payload.nominal || 0),
      from: payload.from,
      to: payload.to,
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
