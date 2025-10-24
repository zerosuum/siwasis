"use server";

import { revalidatePath } from "next/cache";
import { API_BASE } from "@/lib/config";

// CREATE
export async function actionCreateEntry(payload) {
  const { tanggal, keterangan, nominal, type } = payload;
  await fetch(`${API_BASE}/jimpitan/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tanggal,
      keterangan,
      jumlah: Number(nominal),
      type,
    }),
  });
  revalidatePath("/dashboard/jimpitan/laporan");
  return { ok: true };
}

// UPDATE
export async function actionUpdateEntry(payload) {
  const { id, tanggal, keterangan, nominal, type } = payload;
  await fetch(`${API_BASE}/jimpitan/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tanggal,
      keterangan,
      jumlah: Number(nominal),
      type,
    }),
  });
  revalidatePath("/dashboard/jimpitan/laporan");
  return { ok: true };
}

// DELETE
export async function actionDeleteEntry({ id }) {
  await fetch(`${API_BASE}/jimpitan/delete/${id}`, { method: "DELETE" });
  revalidatePath("/dashboard/jimpitan/laporan");
  return { ok: true };
}
