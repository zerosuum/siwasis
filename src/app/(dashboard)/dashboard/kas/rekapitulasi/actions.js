"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { saveKasRekap } from "@/server/actions/kas";

export async function actionSaveRekap(formData) {
  // formData
  const res = await saveKasRekap(formData);
  revalidatePath("/dashboard/kas/rekapitulasi");
  return res;
}
