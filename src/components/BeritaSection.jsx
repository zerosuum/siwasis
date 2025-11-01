"use client";

import BeritaCarousel from "./BeritaCarousel";

export default function BeritaSection({ berita }) {
  return (
    <section className="max-w-[1320px] mx-auto px-16 pb-24">
      <div
        className="
          relative after:shine after:sheen
          flex flex-col items-start gap-4 w-full
          rounded-[100px] p-8
          bg-gradient-to-b from-white/50 to-white/10
          backdrop-blur-md border border-white/40
          shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]
        "
      >
        <h2 className="text-wasis-pr80 font-rem font-bold text-[36px] leading-[46px]">
          Berita Terkini
        </h2>

        <p className="text-wasis-pr80 font-rem font-bold text-[20px] leading-[26px]">
          Ikuti perkembangan terbaru dari Desa Siwalan. Temukan kabar,
          pengumuman, dan informasi penting yang selalu kami perbarui untuk
          Anda.
        </p>

        <a
          href="/blog"
          className="inline-flex h-7 px-3 justify-center items-center rounded-lg
                     bg-wasis-pr60 text-wasis-nt80 text-sm font-semibold"
        >
          Lihat seluruh berita
        </a>
      </div>

      <BeritaCarousel berita={berita} />
    </section>
  );
}
