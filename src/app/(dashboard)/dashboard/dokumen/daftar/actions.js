"use server";

import { revalidatePath } from "next/cache";
import { API_BASE } from "@/server/queries/_api";

const BASE =
  API_BASE || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api";

// UPDATE
export async function actionUpdate(id, form) {
  const fd = new FormData();
  fd.set("_method", "PUT");

  for (const [k, v] of form.entries()) {
    if (k === "file" && v instanceof File && !v.size) continue;
    fd.set(k, v);
  }

  const res = await fetch(`${BASE}/documents/${id}`, {
    method: "POST",
    headers: { Accept: "application/json" },
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

  revalidatePath("/dashboard/dokumen/daftar");
  return { ok: true, data: payload };
}

// DELETE
export async function actionDelete(id) {
  const res = await fetch(`${BASE}/documents/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Delete gagal (${res.status})`);
  revalidatePath("/dashboard/dokumen/daftar");
  return { ok: true };
}

export async function actionUploadDocument(form) {
  const fd = new FormData();
  fd.set("title", form.title);
  if (form.description) fd.set("description", form.description);
  if (form.uploaded_at) fd.set("uploaded_at", form.uploaded_at);
  if (form.file) fd.set("file", form.file);

  const res = await fetch(`${BASE}/documents`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: fd,
  });
  if (!res.ok) throw new Error(`Upload gagal (${res.status})`);
  revalidatePath("/dashboard/dokumen/daftar");
  return { ok: true };
}
