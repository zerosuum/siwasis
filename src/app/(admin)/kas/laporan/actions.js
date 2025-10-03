"use server";

import "server-only";
import { revalidatePath } from "next/cache";

export async function actionCreateEntry(payload) {
  // await createKasEntry(payload);
  revalidatePath("/kas/laporan");
  return { ok: true };
}

export async function actionUpdateEntry(payload) {
  // await updateKasEntry(payload);
  revalidatePath("/kas/laporan");
  return { ok: true };
}

export async function actionDeleteEntry(payload) {
  // await deleteKasEntry(payload);
  revalidatePath("/kas/laporan");
  return { ok: true };
}

export async function actionExportLaporan(params) {
  // await exportKasLaporan(params);
  return { ok: true };
}
