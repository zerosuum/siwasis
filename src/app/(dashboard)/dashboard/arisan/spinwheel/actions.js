"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { postSpinDraw } from "@/server/queries/arisan";
import { getAdminProfile } from "@/lib/session";

export async function actionPostSpinDraw(payload) {
  const profile = await getAdminProfile();
  if (!profile) throw new Error("Akses ditolak. Silakan login.");

  try {
    const res = await postSpinDraw(payload);
    revalidatePath("/dashboard/arisan/spinwheel");
    revalidatePath("/dashboard/arisan/rekapitulasi");
    revalidatePath("/dashboard/warga/tambah-warga");
    return res;
  } catch (err) {
    console.error("actionPostSpinDraw error:", err);
    throw new Error("Gagal menyimpan pemenang arisan.");
  }
}
