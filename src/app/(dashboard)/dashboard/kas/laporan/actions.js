"use server";

import { revalidatePath } from "next/cache";
import { API_BASE } from "@/lib/config";

async function assertOk(res) {
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(
      `HTTP ${res.status} – ${res.statusText} ${txt ? `| ${txt}` : ""}`
    );
  }
}

// CREATE
export async function actionCreateEntry(payload) {
  const { tanggal, keterangan, nominal, type } = payload;

  if (!tanggal) throw new Error("Tanggal wajib diisi");
  if (nominal === "" || Number.isNaN(Number(nominal)))
    throw new Error("Nominal tidak valid");
  if (type !== "IN" && type !== "OUT")
    throw new Error("Type harus IN atau OUT");

  const res = await fetch(`${API_BASE}/kas/laporan/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      tanggal,
      keterangan,
      nominal: Number(nominal), 
      type, // "IN" | "OUT"
    }),
    cache: "no-store",
  });
  await assertOk(res);

  revalidatePath("/dashboard/kas/laporan");
  return { ok: true };
}

// UPDATE
export async function actionUpdateEntry(payload) {
  const { id, tanggal, keterangan, nominal, type } = payload;

  const res = await fetch(`${API_BASE}/kas/laporan/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      tanggal,
      keterangan,
      nominal: Number(nominal),
      type,
    }),
    cache: "no-store",
  });
  await assertOk(res);

  revalidatePath("/dashboard/kas/laporan");
  return { ok: true };
}

// DELETE
export async function actionDeleteEntry({ id }) {
  const res = await fetch(`${API_BASE}/kas/laporan/delete/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  await assertOk(res);

  revalidatePath("/dashboard/kas/laporan");
  return { ok: true };
}
