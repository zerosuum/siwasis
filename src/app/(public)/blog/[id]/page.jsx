import { getAdminProfile } from "@/lib/session";
import { API_BASE } from "@/server/queries/_api";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";

async function fetchOneBerita(id) {
  try {
    const res = await fetch(`${API_BASE}/berita/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
export default async function BeritaDetailPage({ params }) {
  const { id } = params;
  const [profile, item] = await Promise.all([
    getAdminProfile(),
    fetchOneBerita(id),
  ]);
  const isLoggedIn = !!profile;

  if (!item) {
    return <div className="text-center py-48">Berita tidak ditemukan.</div>;
  }

  return (
    <>
      <div className="w-full bg-wasis-pr40 rounded-b-massive shadow-lg">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-16 py-8">
          <Link href="/blog" className="text-sm text-white/80 hover:underline">
            &larr; Kembali ke semua berita
          </Link>
          <h1
            className="font-rem font-bold text-4xl text-wasis-nt80 mt-2"
            style={{ lineHeight: "46px" }}
          >
            {item.title}
          </h1>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div
          className="w-full h-auto p-8 rounded-3xl border border-wasis-pr00 bg-wasis-nt80
                       shadow-[0_2px_4px_-2px_rgba(24,39,75,0.12),_0_4px_4px_-2px_rgba(24,39,75,0.08)]"
        >
          <div className="w-full h-[307px] md:h-[450px] rounded-2xl overflow-hidden relative mb-6">
            <Image
              src={item.image_url || "/placeholder-berita.jpg"}
              alt={item.title || "Berita"}
              fill
              className="object-cover"
            />
          </div>
          <h2
            className="font-rem font-bold text-3xl text-wasis-pr80"
            style={{ lineHeight: "38px" }}
          >
            {item.title}
          </h2>

          <div className="flex items-center gap-2 text-gray-500 mt-3 mb-6">
            <Calendar className="w-4 h-4" />
            <span className="font-rem text-sm">
              {new Date(item.created_at || Date.now()).toLocaleDateString(
                "id-ID",
                { day: "numeric", month: "long", year: "numeric" }
              )}
            </span>
          </div>
          <div
            className="prose prose-lg max-w-none font-rem text-wasis-pr80"
            style={{ lineHeight: "27px" }}
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        </div>
      </div>
    </>
  );
}
