"use server";

import { revalidatePath } from "next/cache";
import { getAdminProfile } from "@/lib/session";
import { cookies } from "next/headers";

export async function actionCreateVideo(payload) {
  const profile = await getAdminProfile();
  if (!profile) throw new Error("Akses ditolak. Silakan login.");

  const cookieStore = await cookies();
  const token = cookieStore.get("siwasis_token")?.value;

  const site = process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000";

  const res = await fetch(`${site}/api/proxy/youtube`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Cookie: `siwasis_token=${token}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = "Gagal menambahkan video.";
    try {
      const j = await res.json();
      if (j.errors) {
        msg = Object.values(j.errors).flat().join(" ");
      } else if (j.message) {
        msg = j.message;
      }
    } catch {}
    throw new Error(msg);
  }

  let data = null;
  try {
    const j = await res.json();
    data = j?.data ?? j ?? null;
  } catch {}

  revalidatePath("/dokumentasi-video");
  revalidatePath("/");

  return data;
}
export async function actionUpdateVideo({ id, title, url }) {
  const profile = await getAdminProfile();
  if (!profile) throw new Error("Akses ditolak. Silakan login.");

  const cookieStore = await cookies();
  const token = cookieStore.get("siwasis_token")?.value;
  const site = process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000";

  const res = await fetch(`${site}/api/proxy/youtube/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Cookie: `siwasis_token=${token}`,
    },
    body: JSON.stringify({ title, url }),
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = "Gagal memperbarui video.";
    try {
      const j = await res.json();
      if (j.errors) {
        msg = Object.values(j.errors).flat().join(" ");
      } else if (j.message) {
        msg = j.message;
      }
    } catch {}
    throw new Error(msg);
  }

  let data = null;
  try {
    const j = await res.json();
    data = j?.data ?? j ?? null;
  } catch {}

  revalidatePath("/dokumentasi-video");
  revalidatePath("/");

  return data;
}

export async function actionDeleteVideo(id) {
  const profile = await getAdminProfile();
  if (!profile) throw new Error("Akses ditolak. Silakan login.");

  const cookieStore = await cookies();
  const token = cookieStore.get("siwasis_token")?.value;
  const site = process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000";

  const res = await fetch(`${site}/api/proxy/youtube/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Cookie: `siwasis_token=${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = "Gagal menghapus video.";
    try {
      const j = await res.json();
      msg = j?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  revalidatePath("/dokumentasi-video");
  revalidatePath("/");

  return true;
}
