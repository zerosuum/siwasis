"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { postSpinDraw } from "@/server/queries/arisan";
import { getAdminProfile } from "@/lib/session";

export async function actionPostSpinDraw({ periode_id, warga_id }) {
  const profile = await getAdminProfile();
  if (!profile) throw new Error("Akses ditolak. Silakan login.");

  try {
    const res = await postSpinDraw({ periode_id, warga_id });
    revalidatePath("/dashboard/arisan/spinwheel");
    revalidatePath("/dashboard/arisan/rekapitulasi");
    revalidatePath("/dashboard/warga/tambah-warga");
    return res;
  } catch (err) {
    console.error("actionPostSpinDraw error:", err);
    throw new Error("Gagal menyimpan pemenang arisan.");
  }
}
