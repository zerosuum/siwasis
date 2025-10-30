"use server";

import { revalidatePath } from "next/cache";
import { API_BASE } from "@/server/queries/_api";

// CREATE
export async function actionCreate(formData) {
  const res = await fetch(`${API_BASE}/documents`, {
    method: "POST",
    body: formData, // FormData
  });
  if (!res.ok) throw new Error("Upload gagal");
  revalidatePath("/dashboard/dokumen/daftar");
  return { ok: true };
}

// UPDATE
export async function actionUpdate(id, formData) {
  const res = await fetch(`${API_BASE}/documents/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) throw new Error("Update gagal");
  revalidatePath("/dashboard/dokumen/daftar");
  return { ok: true };
}

// DELETE
export async function actionDelete(id) {
  const res = await fetch(`${API_BASE}/documents/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete gagal");
  revalidatePath("/dashboard/dokumen/daftar");
  return { ok: true };
}

export async function actionUploadDocument(form) {
  const fd = new FormData();
  fd.set("title", form.title);
  if (form.description) fd.set("description", form.description);
  if (form.uploaded_at) fd.set("uploaded_at", form.uploaded_at);
  fd.set("file_path", form.file);

  const res = await fetch(`${API_BASE}/documents`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error(`Upload gagal: ${res.status}`);

  revalidatePath("/dashboard/dokumen/daftar");
  return { ok: true };
}