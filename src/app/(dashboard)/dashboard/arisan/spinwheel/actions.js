"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { postSpinDraw as queryPostSpinDraw } from "@/server/queries/arisan";

export async function actionPostSpinDraw(payload) {
  // const session = await getSession();
  // if (!session) throw new Error("Akses ditolak");

  try {
    const res = await queryPostSpinDraw(payload);
    revalidatePath("/dashboard/arisan/spinwheel");
    revalidatePath("/dashboard/arisan/rekapitulasi");
    revalidatePath("/dashboard/warga/tambah-warga");
    revalidatePath("/dashboard");
    return res;
  } catch (err) {
    console.error("actionPostSpinDraw error:", err);
    throw new Error("Gagal menyimpan pemenang spin.");
  }
}
