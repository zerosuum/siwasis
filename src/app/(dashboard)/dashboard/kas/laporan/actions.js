"use server";

import { revalidatePath } from "next/cache";
import { API_BASE } from "@/lib/config";

// CREATE
export async function actionCreateEntry(payload) {
  const { tanggal, keterangan, nominal, type } = payload;
  await fetch(`${API_BASE}/sampah/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      tanggal,
      keterangan,
      jumlah: Number(nominal),
      type,
    }),
  });
  revalidatePath("/dashboard/sampah/laporan");
  return { ok: true };
}

// UPDATE
export async function actionUpdateEntry(payload) {
  const { id, tanggal, keterangan, nominal, type } = payload;
  await fetch(`${API_BASE}/sampah/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      tanggal,
      keterangan,
      jumlah: Number(nominal),
      type,
    }),
  });
  revalidatePath("/dashboard/sampah/laporan");
  return { ok: true };
}

// DELETE
export async function actionDeleteEntry({ id }) {
  await fetch(`${API_BASE}/sampah/delete/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  revalidatePath("/dashboard/sampah/laporan");
  return { ok: true };
}
