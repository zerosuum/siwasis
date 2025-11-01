"use client";

import Image from "next/image";
import { useRef } from "react";

export default function BeritaCarousel({ berita = [] }) {
  const scrollerRef = useRef(null);

  const items =
    Array.isArray(berita) && berita.length > 0
      ? berita
      : [
          {
            id: "placeholder-1",
            title:
              "Aksi Bersih Sungai & Penanaman Bibit: Komitmen Jaga Lingkungan",
            date: "24 Oktober 2024",
            image: "/sample/news-1.jpg",
          },
          {
            id: "placeholder-2",
            title:
              "Festival Budaya: Merawat Tradisi & Menguatkan Kearifan Lokal",
            date: "5 Januari 2025",
            image: "/sample/news-2.jpg",
          },
          {
            id: "placeholder-3",
            title: "Kelas Kewirausahaan: Belajar Mandiri Membuka Peluang Usaha",
            date: "12 Februari 2025",
            image: "/sample/news-3.jpg",
          },
        ];

  const scrollBy = (delta) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="mt-8 relative">
      <div
        ref={scrollerRef}
        className="
          flex gap-6 overflow-x-auto scroll-smooth
          snap-x snap-mandatory px-1
        "
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>

        {items.map((n) => (
          <article
            key={n.id || n.slug || n.title}
            className="
              snap-start shrink-0 w-[360px]
              rounded-[24px] border border-white/40
              bg-white/90 backdrop-blur-md shadow-card
              overflow-hidden
            "
          >
            <div className="relative w-full h-[220px]">
              <Image
                src={n.image || "/hero-background.jpg"}
                alt={n.title}
                fill
                className="object-cover"
                sizes="360px"
                priority={false}
              />
            </div>

            <div className="p-4">
              <div className="text-[13px] text-wasis-pr80/80 font-rem">
                {n.date || n.tanggal || ""}
              </div>
              <h3 className="mt-2 font-rem font-bold text-[20px] leading-[26px] text-wasis-pr80 line-clamp-3">
                {n.title}
              </h3>

              <div className="mt-4">
                <a
                  href={
                    n.slug ? `/blog/${n.slug}` : n.href || "/blog#coming-soon"
                  }
                  className="
                    inline-flex h-8 px-3 items-center rounded-lg
                    bg-wasis-pr60 text-wasis-nt80 text-sm font-semibold
                    hover:opacity-90
                  "
                >
                  Selengkapnya
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="pointer-events-none absolute -bottom-12 left-0 right-0 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => scrollBy(-400)}
          className="
            pointer-events-auto w-10 h-10 rounded-full border border-white/30
            bg-wasis-pr40/70 text-wasis-nt80 backdrop-blur
            flex items-center justify-center hover:bg-wasis-pr40
            transition
          "
          aria-label="Prev"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scrollBy(400)}
          className="
            pointer-events-auto w-10 h-10 rounded-full border border-white/30
            bg-wasis-pr40/70 text-wasis-nt80 backdrop-blur
            flex items-center justify-center hover:bg-wasis-pr40
            transition
          "
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>
  );
}
