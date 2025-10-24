"use server";

import { revalidatePath } from "next/cache";
import {
  createSampahEntry,
  updateSampahEntry,
  deleteSampahEntry,
} from "@/server/actions/sampah";
import { API_BASE } from "@/lib/config";

// payload: { tanggal, keterangan?, type: 'IN'|'OUT', nominal }
export async function actionCreateEntry(payload) {
  const { tanggal, keterangan, nominal, type } = payload;
  await fetch(`${API_BASE}/sampah/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tanggal,
      keterangan,
      jumlah: Number(nominal), // mapping dari nominal → jumlah
      type,
    }),
  });
  revalidatePath("/dashboard/sampah/rekapitulasi");
}

// payload: { id, tanggal, keterangan?, type: 'IN'|'OUT', nominal }
export async function actionUpdateEntry(payload) {
  await updateSampahEntry(payload);
  revalidatePath("/dashboard/sampah/rekapitulasi");
  return { ok: true };
}

// payload: { id }
export async function actionDeleteEntry(payload) {
  await deleteSampahEntry(payload.id);
  revalidatePath("/dashboard/sampah/rekapitulasi");
  return { ok: true };
}
