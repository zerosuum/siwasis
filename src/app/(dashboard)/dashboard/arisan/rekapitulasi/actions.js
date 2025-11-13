"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { saveArisanRekap as querySaveArisanRekap } from "@/server/queries/arisan";
import { getAdminProfile } from "@/lib/session";

export async function actionSaveArisanRekap(payload) {
  const profile = await getAdminProfile();
  if (!profile) throw new Error("Akses ditolak. Silakan login.");

  try {
    const res = await querySaveArisanRekap(payload);
    revalidatePath("/dashboard/arisan/rekapitulasi");
    revalidatePath("/dashboard/warga/tambah-warga");
    return res;
  } catch (err) {
    console.error("actionSaveArisanRekap error:", err);
    throw new Error("Gagal menyimpan rekap arisan.");
  }
}
