"use server";

import { revalidatePath } from "next/cache";
import { getAdminProfile } from "@/lib/session";
import { cookies } from "next/headers";

export async function actionCreateBerita(formData) {
  const profile = await getAdminProfile();
  if (!profile) throw new Error("Akses ditolak. Silakan login.");

  const cookieStore = await cookies();
  const token = cookieStore.get("siwasis_token")?.value;

  const site = process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000";

  const res = await fetch(`${site}/api/proxy/articles`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Cookie: `siwasis_token=${token}`,
    },
    body: formData,
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = "Gagal mengirim data ke server.";
    try {
      const j = await res.json();
      if (j.errors) {
        msg = Object.values(j.errors).flat().join(", ");
      } else {
        msg = j?.message || msg;
      }
    } catch {}
    throw new Error(msg);
  }

  let data = null;
  try {
    const j = await res.json();
    data = j?.data ?? j ?? null;
  } catch {}

  revalidatePath("/blog");
  revalidatePath("/");

  return data;
}

/**
 * UPDATE BERITA
 * - Kirim FormData yg berisi _method=PUT, title, content, optional image
 */
export async function actionUpdateBerita(id, formData) {
  const profile = await getAdminProfile();
  if (!profile) throw new Error("Akses ditolak. Silakan login.");

  const cookieStore = await cookies();
  const token = cookieStore.get("siwasis_token")?.value;
  const site = process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000";

  const res = await fetch(`${site}/api/proxy/articles/${id}`, {
    method: "POST", // pakai method spoofing _method=PUT
    headers: {
      Accept: "application/json",
      Cookie: `siwasis_token=${token}`,
    },
    body: formData,
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = "Gagal memperbarui berita.";
    try {
      const j = await res.json();
      if (j.errors) {
        msg = Object.values(j.errors).flat().join(", ");
      } else {
        msg = j?.message || msg;
      }
    } catch {}
    throw new Error(msg);
  }

  let data = null;
  try {
    const j = await res.json();
    data = j?.data ?? j ?? null;
  } catch {}

  revalidatePath("/blog");
  revalidatePath("/");
  return data;
}

/**
 * DELETE BERITA
 */
export async function actionDeleteBerita(id) {
  const profile = await getAdminProfile();
  if (!profile) throw new Error("Akses ditolak. Silakan login.");

  const cookieStore = await cookies();
  const token = cookieStore.get("siwasis_token")?.value;
  const site = process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000";

  const res = await fetch(`${site}/api/proxy/articles/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Cookie: `siwasis_token=${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = "Gagal menghapus berita.";
    try {
      const j = await res.json();
      msg = j?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  revalidatePath("/blog");
  revalidatePath("/");
  return true;
}