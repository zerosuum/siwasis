"use server";

import { revalidatePath } from "next/cache";
import { API_BASE } from "@/lib/config";
import { getAdminProfile } from "@/lib/session";
import { cookies } from "next/headers";
import https from "https";

async function getAuth() {
  const profile = await getAdminProfile();
  if (!profile) throw new Error("Akses ditolak. Silakan login.");

  const cookieStore = await cookies();
  const token = cookieStore.get("siwasis_token")?.value || null;
  if (!token) throw new Error("Token tidak ditemukan. Silakan login kembali.");

  return { profile, token };
}

async function createAuthHeaders(token) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const REVALIDATE_PATH = "/dashboard/sampah/laporan";
const API_PREFIX = "/sampah";

async function assertOkOrThrow(res) {
  if (res.ok) return;
  let msg = `HTTP ${res.status}`;
  try {
    const data = await res.json();
    if (data?.message) msg = data.message;
  } catch (_) {
    // biarin pakai msg default
  }
  throw new Error(msg);
}

// CREATE
export async function actionCreateEntry(payload) {
  const { token } = await getAuth();
  const authHeaders = await createAuthHeaders(token);

  const { tanggal, keterangan, nominal, type } = payload;
  const backendTipe = type === "IN" ? "pemasukan" : "pengeluaran";

  const res = await fetch(`${API_BASE}${API_PREFIX}/create`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      tanggal,
      keterangan,
      jumlah: Number(nominal),
      tipe: backendTipe,
    }),
    agent: httpsAgent,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status} saat create sampah`);
  }

  revalidatePath(REVALIDATE_PATH);
  return { ok: true, data };
}

// UPDATE
export async function actionUpdateEntry(payload) {
  const { token } = await getAuth();
  const authHeaders = await createAuthHeaders(token);

  const { id, tanggal, keterangan, nominal, type } = payload;
  const backendTipe = type === "IN" ? "pemasukan" : "pengeluaran";

  const res = await fetch(`${API_BASE}${API_PREFIX}/update/${id}`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify({
      tanggal,
      keterangan,
      jumlah: Number(nominal),
      tipe: backendTipe,
    }),
    agent: httpsAgent,
  });

  await assertOkOrThrow(res);
  revalidatePath(REVALIDATE_PATH);
  return { ok: true };
}

// DELETE
export async function actionDeleteEntry({ id }) {
  const { token } = await getAuth();

  const headers = {
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${API_PREFIX}/delete/${id}`, {
    method: "DELETE",
    headers,
    agent: httpsAgent,
  });

  await assertOkOrThrow(res);
  revalidatePath(REVALIDATE_PATH);
  return { ok: true };
}
