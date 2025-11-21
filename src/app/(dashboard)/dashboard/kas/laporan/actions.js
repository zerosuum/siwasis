"use server";

import { revalidatePath } from "next/cache";
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

async function assertOk(res) {
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(
      `HTTP ${res.status} – ${res.statusText} ${txt ? `| ${txt}` : ""}`
    );
  }
}

function mapTypeToTipe(type) {
  if (type === "IN") return "pemasukan";
  if (type === "OUT") return "pengeluaran";
  throw new Error("Type harus IN atau OUT");
}

// CREATE
export async function actionCreateEntry(payload) {
  await checkAuth();
  const token = await getAuthToken();

  const { tanggal, keterangan, nominal, type } = payload;

  if (!tanggal) throw new Error("Tanggal wajib diisi");
  if (nominal === "" || Number.isNaN(Number(nominal))) {
    throw new Error("Nominal tidak valid");
  }
  if (type !== "IN" && type !== "OUT") {
    throw new Error("Type harus IN atau OUT");
  }

  const tipe = mapTypeToTipe(type);
  const jumlah = Number(nominal);

  const res = await fetch(`${API_BASE}/kas/laporan/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      tanggal,
      keterangan,
      tipe,
      jumlah,
    }),
    cache: "no-store",
  });

  await assertOk(res);

  revalidatePath("/dashboard/kas/laporan");
  return { ok: true };
}

// UPDATE
export async function actionUpdateEntry(payload) {
  await checkAuth();
  const token = await getAuthToken();

  const { id, tanggal, keterangan, nominal, type } = payload;

  if (!id) throw new Error("ID transaksi wajib diisi");
  if (!tanggal) throw new Error("Tanggal wajib diisi");
  if (nominal === "" || Number.isNaN(Number(nominal))) {
    throw new Error("Nominal tidak valid");
  }
  if (type !== "IN" && type !== "OUT") {
    throw new Error("Type harus IN atau OUT");
  }

  const tipe = mapTypeToTipe(type);
  const jumlah = Number(nominal);

  const res = await fetch(`${API_BASE}/kas/laporan/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      tanggal,
      keterangan,
      tipe,
      jumlah,
    }),
    cache: "no-store",
  });

  await assertOk(res);

  revalidatePath("/dashboard/kas/laporan");
  return { ok: true };
}

// DELETE
export async function actionDeleteEntry({ id }) {
  await checkAuth();
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE}/kas/laporan/delete/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  await assertOk(res);

  revalidatePath("/dashboard/kas/laporan");
  return { ok: true };
}
