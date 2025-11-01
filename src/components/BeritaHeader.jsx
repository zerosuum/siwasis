import Link from "next/link";
import SectionPill from "@/components/SectionPill";

export default function BeritaHeader() {
  return (
    <section className="w-full">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
        <SectionPill
          title="Berita Terkini"
          subtitle="Ikuti perkembangan terbaru dari Desa Siwalan. Temukan kabar, pengumuman, dan informasi penting yang selalu kami perbarui untuk Anda."
          className="mb-4 md:mb-6"
        >
          <Link
            href="/blog"
            className="mt-4 inline-flex h-8 px-3 items-center rounded-lg bg-wasis-pr60 text-wasis-nt80 text-sm font-semibold"
          >
            Lihat seluruh berita
          </Link>
        </SectionPill>
      </div>
    </section>
  );
}
