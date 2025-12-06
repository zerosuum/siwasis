"use server";

import { revalidatePath } from "next/cache";
import { getAdminProfile } from "@/lib/session";
import { cookies } from "next/headers";
import { API_BASE } from "@/lib/config";

const BASE =
  API_BASE || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api";

async function getAuthHeaders() {
  const profile = await getAdminProfile();
  if (!profile) {
    throw new Error("Akses ditolak. Silakan login.");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("siwasis_token")?.value;
  if (!token) {
    throw new Error("Token tidak ditemukan. Silakan login kembali.");
  }

  const headers = { Accept: "application/json" };
  headers["Authorization"] = `Bearer ${token}`;

  return headers;
}

export async function actionCreateBerita(formData) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${BASE}/articles`, {
    method: "POST",
    headers,
    body: formData,
    cache: "no-store",
  });

  const ct = res.headers.get("content-type") || "";
  let payload = null;

  if (ct.includes("application/json")) {
    payload = await res.json().catch(() => null);
  }

  if (!res.ok) {
    let msg = "Gagal mengirim data ke server.";
    if (payload?.errors) {
      msg = Object.values(payload.errors).flat().join(", ");
    } else if (payload?.message) {
      msg = payload.message;
    }
    console.error("Create berita gagal:", res.status, payload);
    throw new Error(msg);
  }

  const data = payload?.data ?? payload ?? null;

  revalidatePath("/blog");
  revalidatePath("/");

  return data;
}

export async function actionUpdateBerita(id, formData) {
  const headers = await getAuthHeaders();

  if (!formData.has("_method")) {
    formData.set("_method", "PUT");
  }

  const res = await fetch(`${BASE}/articles/${id}`, {
    method: "POST",
    headers,
    body: formData,
    cache: "no-store",
  });

  const ct = res.headers.get("content-type") || "";
  let payload = null;
  if (ct.includes("application/json")) {
    payload = await res.json().catch(() => null);
  }

  if (!res.ok) {
    let msg = "Gagal memperbarui berita.";
    if (payload?.errors) {
      msg = Object.values(payload.errors).flat().join(", ");
    } else if (payload?.message) {
      msg = payload.message;
    }
    console.error("Update berita gagal:", res.status, payload);
    throw new Error(msg);
  }

  const data = payload?.data ?? payload ?? null;

  revalidatePath("/blog");
  revalidatePath("/");
  return data;
}

export async function actionDeleteBerita(id) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${BASE}/articles/${id}`, {
    method: "DELETE",
    headers,
    cache: "no-store",
  });

  const ct = res.headers.get("content-type") || "";
  let payload = null;
  if (ct.includes("application/json")) {
    payload = await res.json().catch(() => null);
  }

  if (!res.ok) {
    let msg = "Gagal menghapus berita.";
    if (payload?.message) msg = payload.message;
    console.error("Delete berita gagal:", res.status, payload);
    throw new Error(msg);
  }

  revalidatePath("/blog");
  revalidatePath("/");
  return true;
}
