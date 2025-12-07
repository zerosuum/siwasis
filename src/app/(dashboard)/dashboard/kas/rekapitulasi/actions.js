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
  await getAuthToken();
  const res = await saveKasRekap(payload);

  revalidatePath("/dashboard/kas/rekapitulasi");
  revalidatePath("/dashboard/kas/laporan");

  return res;
}

export async function actionCreatePeriod(payload) {
  await checkAuth();
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE}/periode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nama: payload.name,
      nominal: Number(payload.nominal || 0),
      tanggal_mulai: payload.from,
      tanggal_selesai: payload.to,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Create period failed: ${res.status} ${txt}`);
  }

  const json = await res.json().catch(() => ({}));
  const data = json?.data ?? json?.periode ?? json ?? {};

  const fromDate = data.tanggal_mulai || data.start_date || payload.from;
  let newYear;

  if (fromDate && typeof fromDate === "string" && fromDate.length >= 4) {
    const y = Number(fromDate.slice(0, 4));
    newYear = Number.isFinite(y) ? y : undefined;
  }

  if (!newYear) {
    const nameSource = data.nama || payload.name || "";
    const match = String(nameSource).match(/\b(20\d{2})\b/);
    if (match) newYear = Number(match[1]);
  }

  if (!newYear) {
    newYear = new Date().getFullYear();
  }

  revalidatePath("/dashboard/kas/rekapitulasi");
  revalidatePath("/dashboard/kas/laporan");
  revalidatePath("/dashboard");

  return { ok: true, year: Number(newYear) };
}

export async function actionUpdatePeriod(payload) {
  await checkAuth();
  const token = await getAuthToken();

  if (!payload?.id) {
    throw new Error("ID periode wajib diisi untuk edit.");
  }

  const res = await fetch(`${API_BASE}/periode/${payload.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nama: payload.name,
      nominal: Number(payload.nominal || 0),
      tanggal_mulai: payload.from,
      tanggal_selesai: payload.to,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Update period failed: ${res.status} ${txt}`);
  }

  const json = await res.json().catch(() => ({}));
  const data = json?.data ?? json?.periode ?? json ?? {};

  const fromDate = data.tanggal_mulai || data.start_date || payload.from;
  let newYear;

  if (fromDate && typeof fromDate === "string" && fromDate.length >= 4) {
    const y = Number(fromDate.slice(0, 4));
    newYear = Number.isFinite(y) ? y : undefined;
  }

  if (!newYear) {
    const nameSource = data.nama || payload.name || "";
    const match = String(nameSource).match(/\b(20\d{2})\b/);
    if (match) newYear = Number(match[1]);
  }

  if (!newYear) {
    newYear = new Date().getFullYear();
  }

  revalidatePath("/dashboard/kas/rekapitulasi");
  revalidatePath("/dashboard/kas/laporan");
  revalidatePath("/dashboard");

  return { ok: true, year: Number(newYear) };
}

export async function actionDeletePeriod(id) {
  await checkAuth();
  const token = await getAuthToken();

  if (!id) {
    throw new Error("ID periode wajib diisi.");
  }

  const res = await fetch(`${API_BASE}/periode/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Delete period failed: ${res.status} ${txt}`);
  }

  revalidatePath("/dashboard/kas/rekapitulasi");
  revalidatePath("/dashboard/kas/laporan");
  revalidatePath("/dashboard");

  return { ok: true };
}
