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

// CREATE
export async function actionCreateEntry(payload) {
  const { token } = await getAuth();
  const authHeaders = await createAuthHeaders(token);

  const { tanggal, keterangan, nominal, type } = payload; // type is "IN" or "OUT"


  const backendTipe = type === "IN" ? "pemasukan" : "pengeluaran";

  const res = await fetch(`${API_BASE}/jimpitan/create`, {
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

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  revalidatePath("/dashboard/jimpitan/laporan");
  return { ok: true };
}

// UPDATE
export async function actionUpdateEntry(payload) {
  const { token } = await getAuth();
  const authHeaders = await createAuthHeaders(token);

  const { id, tanggal, keterangan, nominal, type } = payload; // type is "IN" or "OUT"

  const backendTipe = type === "IN" ? "pemasukan" : "pengeluaran";

  const res = await fetch(`${API_BASE}/jimpitan/update/${id}`, {
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

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  revalidatePath("/dashboard/jimpitan/laporan");
  return { ok: true };
}

// DELETE
export async function actionDeleteEntry({ id }) {
  const { token } = await getAuth();
  const authHeaders = await createAuthHeaders(token);

  const res = await fetch(`${API_BASE}/jimpitan/delete/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders, "Content-Type": undefined },
    agent: httpsAgent,
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  revalidatePath("/dashboard/jimpitan/laporan");
  return { ok: true };
}
