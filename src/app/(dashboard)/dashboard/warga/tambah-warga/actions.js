"use server";

import { revalidatePath } from "next/cache";
import {
  createWarga,
  updateWarga,
  deleteWarga,
  // addKasMember,
  // addArisanMember,
} from "@/server/queries/warga";
import { getAdminProfile } from "@/lib/session";
import { cookies } from "next/headers";

const revalidateAll = () => {
  revalidatePath("/dashboard/warga/tambah-warga");
  revalidatePath("/dashboard/kas/rekapitulasi");
  revalidatePath("/dashboard/arisan/rekapitulasi");
  revalidatePath("/dashboard/arisan/spinwheel");
  revalidatePath("/dashboard");
};

async function getAuth() {
  const profile = await getAdminProfile();
  if (!profile) throw new Error("Akses ditolak. Silakan login.");

  const cookieStore = await cookies();

  const token = cookieStore.get("siwasis_token")?.value || null;
  if (!token) throw new Error("Token tidak ditemukan. Silakan login kembali.");

  return { profile, token };
}

export async function actionCreateWarga(payload, variant) {
  const { token } = await getAuth();
  try {
    const created = await createWarga(token, payload, variant);

    revalidateAll();
    return {
      ok: true,
      message: "Warga berhasil ditambahkan.",
    };
  } catch (err) {
    console.error(err);
    if (err.message.includes("422")) {
      throw new Error("Input tidak valid. Cek kembali data.");
    }
    throw new Error(err.message || "Gagal membuat warga.");
  }
}

export async function actionUpdateWarga(id, payload) {
  const { token } = await getAuth();
  try {
    await updateWarga(token, id, payload);
    revalidateAll();
    return { ok: true };
  } catch (err) {
    console.error(err);
    throw new Error(err.message || "Gagal update warga.");
  }
}

export async function actionDeleteWarga(id) {
  const { token } = await getAuth();
  try {
    await deleteWarga(token, id);
    revalidateAll();
    return { ok: true };
  } catch (err) {
    console.error(err);
    throw new Error(err.message || "Gagal menghapus warga.");
  }
}
// export async function actionAddArisanMember(warga) {
//   const { token } = await getAuth();

//   try {
//     await addArisanMember(token, { warga_id: warga.id });

//     revalidateAll();
//     return { ok: true };
//   } catch (err) {
//     console.error(err);
//     throw new Error(err.message || "Gagal menandai anggota arisan.");
//   }
// }

// export async function actionAddKasMember(warga) {
//   const { token } = await getAuth();

//   try {
//     await addKasMember(token, { warga_id: warga.id });

//     revalidateAll();
//     return { ok: true };
//   } catch (err) {
//     console.error(err);
//     throw new Error(err.message || "Gagal menambah anggota kas.");
//   }
// }