"use server";

import { revalidatePath } from "next/cache";
import {
  getProfile,
  getAdmins,
  createAdmin,
  updateProfile,
  changePassword,
  deleteAdmin,
} from "@/server/queries/settings";

// Tambah Admin
export async function actionCreateAdmin(payload) {
  await createAdmin(null, payload);
  revalidatePath("/dashboard/settings");
  return { ok: true };
}

// Ubah Profil
export async function actionUpdateProfile(formData) {
  const res = await updateProfile(null, formData);
  revalidatePath("/dashboard/settings");
  return res;
}

// Ubah Password
export async function actionChangePassword(payload) {
  await changePassword(null, payload);
  return { ok: true };
}

// Hapus Admin
export async function actionDeleteAdmin(id) {
  await deleteAdmin(null, id);
  revalidatePath("/dashboard/settings");
  return { ok: true };
}
