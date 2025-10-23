import "server-only";
import { revalidatePath } from "next/cache";
import {
  createSampahEntry,
  updateSampahEntry,
  deleteSampahEntry,
} from "@/server/actions/sampah";

export async function actionCreateEntry(payload) {
  await createSampahEntry(payload);
  revalidatePath("/dashboard/sampah/laporan");
  return { ok: true };
}
export async function actionUpdateEntry(payload) {
  await updateSampahEntry(payload);
  revalidatePath("/dashboard/sampah/laporan");
  return { ok: true };
}
export async function actionDeleteEntry({ id }) {
  await deleteSampahEntry(id);
  revalidatePath("/dashboard/sampah/laporan");
  return { ok: true };
}
