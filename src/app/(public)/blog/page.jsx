import { API_BASE, fetchData } from "@/server/queries/_api";
import { getAdminProfile } from "@/lib/session";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import SectionPill from "@/components/SectionPill";

export default async function BlogPage() {
  const [profile, allBerita] = await Promise.all([
    getAdminProfile(),
    fetchData("/berita"),
  ]);
  const isLoggedIn = !!profile;

  return (
    <div className="w-full">
      <div className="w-full bg-wasis-pr40 rounded-b-massive shadow-[0_8px_28px_-6px_rgba(24,39,75,0.12),_0_18px_88px_-4px_rgba(24,39,75,0.14)]">
        <div className="w-full max-w-[1440px] mx-auto px-4 py-8">
          <div className="grid grid-cols-[12px_1fr]">
            <div /> {/* spacer kiri 12px */}
            <div className="w-full">
              <SectionPill
                title="Berita Terkini"
                subtitle="Temukan kabar, pengumuman, dan informasi penting yang selalu kami perbarui untuk Anda."
                className="w-full bg-transparent !border-0 !shadow-none p-0"
                titleClass="text-wasis-nt80"
                subtitleClass="text-wasis-nt80/90"
              >
                {isLoggedIn && (
                  <Link
                    href="/blog/new"
                    className="mt-3 inline-block text-wasis-nt80/90 text-base font-medium underline underline-offset-[6px] decoration-wasis-nt80/40 hover:decoration-wasis-nt80 transition-all"
                  >
                    Bagikan informasi baru di sini
                  </Link>
                )}
              </SectionPill>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-4 py-12 flex flex-col items-center gap-8">
        {Array.isArray(allBerita) && allBerita.length > 0 ? (
          allBerita.map((item) => <BlogCard key={item.id} item={item} />)
        ) : (
          <p className="text-gray-500 col-span-3 text-center py-24">
            Belum ada berita untuk ditampilkan.
          </p>
        )}
      </div>
    </div>
  );
}