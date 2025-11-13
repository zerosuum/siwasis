"use server";

import { revalidateTag } from "next/cache";
import { API_BASE } from "@/lib/config";
import { getAdminProfile } from "@/lib/session";
import { cookies } from "next/headers";

const BASE =
  API_BASE || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api";

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
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// UPDATE
export async function actionUpdate(id, form) {
  const { token } = await getAuth();
  const authHeaders = await createAuthHeaders(token);

  const fd = new FormData();
  fd.set("_method", "PUT");

  for (const [k, v] of form.entries()) {
    if (k === "file" && v instanceof File && !v.size) continue;
    fd.set(k, v);
  }

  const res = await fetch(`${BASE}/documents/${id}`, {
    method: "POST",
    headers: authHeaders,
    body: fd,
  });

  const ct = res.headers.get("content-type") || "";
  const payload = ct.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => "");

  if (!res.ok) {
    console.error("Update gagal:", res.status, payload);
    throw new Error(
      `Update gagal (${res.status}) ${
        payload?.message ||
        (typeof payload === "string" ? payload.slice(0, 300) : "")
      }`
    );
  }
  revalidateTag("documents");
  return { ok: true, data: payload };
}

// DELETE
export async function actionDelete(id) {
  const { token } = await getAuth();
  const authHeaders = await createAuthHeaders(token);

  const res = await fetch(`${BASE}/documents/${id}`, {
    method: "DELETE",
    headers: authHeaders,
  });
  if (!res.ok) throw new Error(`Delete gagal (${res.status})`);
  revalidateTag("documents");
  return { ok: true };
}

export async function actionUploadDocument(form) {
  const { token } = await getAuth();
  const authHeaders = await createAuthHeaders(token);

  const res = await fetch(`${BASE}/documents`, {
    method: "POST",
    headers: authHeaders,
    body: form,
  });

  const responseData = await res.json().catch(() => null);
  console.log(" Response");
  console.log(responseData);
  console.log(" - ");

  // Cek jika status tidak ok
  if (!res.ok) {
    console.error("Upload gagal (res not ok):", responseData);
    throw new Error(responseData?.message || `Upload gagal (${res.status})`);
  }

  // Cek jika Laravel bilang gagal meskipun status 200 OK
  if (responseData && responseData.success === false) {
    console.error(
      "Upload gagal (Laravel bilang success=false):",
      responseData.message
    );
    throw new Error(responseData.message || "Backend menolak upload.");
  }

  revalidateTag("documents");
  return { ok: true };
}
