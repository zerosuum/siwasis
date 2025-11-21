import { redirect } from "next/navigation";
import { getAdminProfile } from "@/lib/session";
import { fetchFirstData } from "@/server/queries/_api";
import { normalizeArticle } from "@/lib/articles";
import EditBeritaClient from "./EditBeritaClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchOneBerita(id) {
  const out = await fetchFirstData([
    `/berita/${id}`,
    `/articles/${id}`,
    `/news/${id}`,
  ]);
  return !Array.isArray(out) && out ? out : null;
}

export default async function EditBeritaPage({ params }) {
  const { id } = await params;

  const profile = await getAdminProfile();
  if (!profile) {
    redirect(`/login?next=/blog/${id}/edit`);
  }

  const rawItem = await fetchOneBerita(id);
  const item = normalizeArticle(rawItem);

  if (!item) {
    return <div className="text-center py-48">Berita tidak ditemukan.</div>;
  }

  return <EditBeritaClient initial={item} />;
}
