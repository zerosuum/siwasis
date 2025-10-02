"use server";
import "server-only";
import { revalidatePath } from "next/cache";
import { saveKasRekap } from "@/server/actions/kas";

export async function actionSaveRekap(formData) {
 const json = formData.get("payload");
 const payload = JSON.parse(json);

 const res = await saveKasRekap(payload);
 revalidatePath("/kas/rekapitulasi");
 return res;
}
