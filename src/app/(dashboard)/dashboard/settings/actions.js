"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import {
  createAdmin as queryCreateAdmin,
  updateProfile as queryUpdateProfile,
  changePassword as queryChangePassword,
} from "@/server/queries/settings";

// Di sini juga bisa ditambahkan cek sesi admin
// import { getSession } from "@/lib/session";
// const checkAuth = async () => { ... };

const revalidate = () => {
  revalidatePath("/dashboard/settings");
};

export async function actionCreateAdmin(payload) {
  // await checkAuth();
  try {
    const res = await queryCreateAdmin(payload);
    revalidate();
    return res;
  } catch (err) {
    console.error(err);
    throw new Error(err.message || "Gagal membuat admin baru.");
  }
}

export async function actionUpdateProfile(payload) {
  // await checkAuth();
  try {
    const res = await queryUpdateProfile(payload);
    revalidate();
    return res;
  } catch (err) {
    console.error(err);
    throw new Error(err.message || "Gagal memperbarui profil.");
  }
}

export async function actionChangePassword(payload) {
  // await checkAuth();
  try {
    const res = await queryChangePassword(payload);
    revalidate(); // Revalidasi path, tapi tidak ada data sensitif yg berubah
    return res;
  } catch (err) {
    console.error(err);
    throw new Error(err.message || "Gagal mengubah password.");
  }
}
