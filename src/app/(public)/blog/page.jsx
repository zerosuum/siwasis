import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import SectionPill from "@/components/SectionPill";
import { getAdminProfile } from "@/lib/session";
import { fetchFirstData, hasAnyEndpoint } from "@/server/queries/_api";
import { normalizeArticleList } from "@/lib/articles";

export const dynamic = "force-dynamic";
export const revalidate = 0;


export default async function BlogPage() {
  const [profile, allBerita, canCreate] = await Promise.all([
    getAdminProfile(),
    fetchFirstData(["/berita", "/articles", "/news"]),
    hasAnyEndpoint(["/berita", "/articles", "/news"], { viaProxy: true }),
  ]);

  const isLoggedIn = !!profile;

  const listRaw = Array.isArray(allBerita) ? allBerita : [];
  const list = normalizeArticleList(listRaw);

  return (
    <div className="w-full">
      <div className="w-full bg-wasis-pr40 rounded-b-massive shadow-[0_8px_28px_-6px_rgba(24,39,75,0.12),_0_18px_88px_-4px_rgba(24,39,75,0.14)]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-10">
          <div className="grid md:grid-cols-[12px_1fr]">
            <div className="hidden md:block" />
            <div className="w-full">
              <SectionPill
                title="Berita Terkini"
                subtitle="Temukan kabar, pengumuman, dan informasi penting yang selalu kami perbarui untuk Anda."
                className="w-full bg-transparent !border-0 !shadow-none p-0 text-center md:text-left"
                titleClass="text-wasis-nt80 text-2xl md:text-3xl font-rem font-bold"
                subtitleClass="text-wasis-nt80/90 mt-2"
              >
                {isLoggedIn && (
                  <div className="mt-4 flex justify-center md:justify-start">
                    <Link
                      href="/blog/new"
                      className="inline-block text-wasis-nt80/90 text-base font-medium underline underline-offset-[6px] decoration-wasis-nt80/40 hover:decoration-wasis-nt80 transition-all"
                    >
                      Bagikan informasi baru di sini
                    </Link>
                  </div>
                )}
              </SectionPill>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-4 py-10 sm:py-12 flex flex-col items-center gap-8">
        {list.length > 0 ? (
          list.map((item) => (
            <BlogCard key={item.id} item={item} canManage={isLoggedIn} />
          ))
        ) : (
          <p className="text-gray-500 text-center py-24">
            Belum ada berita untuk ditampilkan.
          </p>
        )}
      </div>

      <div className="w-full border-t border-wasis-pr00/40">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-4 py-6 flex justify-between items-center">
          <Link
            href="/"
            className="text-xs sm:text-sm text-wasis-pr60 hover:underline"
          >
            &larr; Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
