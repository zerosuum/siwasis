// src/app/dashboard/kas/laporan/actions.js
"use server";
import "server-only";
import { revalidatePath } from "next/cache";
import {
  createKasEntry,
  updateKasEntry,
  deleteKasEntry,
} from "@/server/actions/kas";

export async function actionCreateEntry(payload) {
  await createKasEntry(payload); // {tanggal, keterangan?, type: 'IN'|'OUT', nominal}
  revalidatePath("/dashboard/kas/laporan");
  return { ok: true };
}
export async function actionUpdateEntry(payload) {
  await updateKasEntry(payload); // {id, tanggal, keterangan?, type, nominal}
  revalidatePath("/dashboard/kas/laporan");
  return { ok: true };
}
export async function actionDeleteEntry(payload) {
  await deleteKasEntry(payload.id); // {id}
  revalidatePath("/dashboard/kas/laporan");
  return { ok: true };
}
