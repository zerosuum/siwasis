import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { getAdminProfile } from "@/lib/session";
import { fetchFirstData } from "@/server/queries/_api";
import { normalizeArticle } from "@/lib/articles";

async function fetchOneBerita(id) {
  const out = await fetchFirstData([
    `/berita/${id}`,
    `/articles/${id}`,
    `/news/${id}`,
  ]);
  return !Array.isArray(out) && out ? out : null;
}

export default async function BeritaDetailPage({ params }) {
  const { id } = await params;

  const [profile, rawItem] = await Promise.all([
    getAdminProfile(),
    fetchOneBerita(id),
  ]);

  const item = normalizeArticle(rawItem);

  if (!item) {
    return <div className="text-center py-48">Berita tidak ditemukan.</div>;
  }

  return (
    <>
      <div
        className="w-full bg-wasis-pr40 
                rounded-b-[40px] sm:rounded-b-[56px] lg:rounded-b-massive 
                shadow-[0_8px_28px_-6px_rgba(24,39,75,0.12),_0_18px_88px_-4px_rgba(24,39,75,0.14)]"
      >
        <div
          className="w-full max-w-[1320px] mx-auto 
                  px-4 sm:px-6 lg:px-10 
                  py-10 sm:py-12 lg:py-16"
        >
          <h1
            className="font-rem font-bold 
                  text-2xl sm:text-3xl lg:text-4xl 
                  text-wasis-nt80 mt-3 leading-tight"
          >
            {item.title}
          </h1>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full h-auto p-4 sm:p-6 lg:p-8 rounded-3xl border border-wasis-pr00 bg-wasis-nt80 shadow-[0_2px_4px_-2px_rgba(24,39,75,0.12),_0_4px_4px_-2px_rgba(24,39,75,0.08)]">
          <div className="w-full h-[220px] sm:h-[280px] md:h-[340px] lg:h-[420px] rounded-2xl overflow-hidden relative mb-4 sm:mb-6">
            <Image
              src={item.image_url || "/sample/news-1.jpg"}
              alt={item.title || "Berita"}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <h2
            className="font-rem font-bold text-2xl sm:text-3xl text-wasis-pr80"
            style={{ lineHeight: "1.3" }}
          >
            {item.title}
          </h2>

          <div className="flex items-center gap-2 text-gray-500 mt-2 mb-4 sm:mb-6 text-xs sm:text-sm">
            <Calendar className="w-4 h-4" />
            <span className="font-rem">
              {new Date(item.created_at || Date.now()).toLocaleDateString(
                "id-ID",
                { day: "numeric", month: "long", year: "numeric" }
              )}
            </span>
          </div>

          <div
            className="tiptap-content font-rem text-wasis-pr80"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        </div>

        <div className="mt-8 pt-4 border-t border-wasis-pr00/40 flex justify-between items-center">
          <Link
            href="/blog"
            className="text-xs sm:text-sm text-wasis-pr60 hover:underline"
          >
            &larr; Kembali ke semua berita
          </Link>
        </div>
      </div>
    </>
  );
}
