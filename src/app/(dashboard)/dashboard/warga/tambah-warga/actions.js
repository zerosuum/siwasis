"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import {
  createWarga,
  updateWarga,
  deleteWarga,
  addKasMember,
  addArisanMember,
} from "@/server/queries/warga";

// import { getSession } from "@/lib/session";
// const checkAuth = async () => {
//   const session = await getSession();
//   if (!session) throw new Error("Akses ditolak");
// };

const revalidateAll = () => {
  revalidatePath("/dashboard/warga/tambah-warga");
  revalidatePath("/dashboard/kas/rekapitulasi");
  revalidatePath("/dashboard/arisan/rekapitulasi");
  revalidatePath("/dashboard/arisan/spinwheel");
  revalidatePath("/dashboard");
};

export async function actionCreateWarga(payload, variant) {
  try {
    const created = await createWarga(payload);
    if (variant === "KAS") {
      await addKasMember(created.id);
    }
    if (variant === "ARISAN") {
      await addKasMember(created.id);
      await addArisanMember(created.id);
    }

    revalidateAll();
    return {
      ok: true,
      message:
        variant === "KAS"
          ? "Warga ditambahkan & ditandai anggota Kas."
          : variant === "ARISAN"
          ? "Warga ditambahkan & ditandai anggota Arisan & Kas."
          : "Warga ditambahkan.",
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
  // await checkAuth();
  try {
    await updateWarga(id, payload);
    revalidateAll();
    return { ok: true };
  } catch (err) {
    console.error(err);
    throw new Error(err.message || "Gagal update warga.");
  }
}

export async function actionDeleteWarga(id) {
  // await checkAuth();
  try {
    await deleteWarga(id);
    revalidateAll();
    return { ok: true };
  } catch (err) {
    console.error(err);
    throw new Error(err.message || "Gagal menghapus warga.");
  }
}

export async function actionAddArisanMember(wargaId) {
  // await checkAuth();
  try {
    await addKasMember(wargaId);
    await addArisanMember(wargaId);
    revalidateAll();
    return { ok: true };
  } catch (err) {
    console.error(err);
    throw new Error(err.message || "Gagal menambah anggota arisan.");
  }
}
