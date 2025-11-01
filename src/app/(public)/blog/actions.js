"use server";
import { revalidatePath } from "next/cache";
import { API_BASE } from "@/server/queries/_api";
import { getAdminProfile } from "@/lib/session";

export async function actionCreateBerita(payload) {
  const { title, content, imageUrl } = payload;

  const profile = await getAdminProfile();
  if (!profile) {
    throw new Error("Anda tidak punya hak akses!");
  }

  const res = await fetch(`${API_BASE}/berita`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
      image_url: imageUrl,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal mengirim data ke server.");
  }

  revalidatePath("/blog");
  revalidatePath("/"); 

  return await res.json();
}
