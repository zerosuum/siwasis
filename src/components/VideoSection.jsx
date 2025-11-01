"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

function VideoCard({ cover, title, href = "#" }) {
  return (
    <article
      className={`
        flex w-[360px] h-[378px] min-h-[378px] flex-col justify-between
        rounded-[24px] bg-white
        shadow-[0_2px_4px_-2px_rgba(24,39,75,.12),0_4px_4px_-2px_rgba(24,39,75,.08)]
        p-6
      `}
    >
      <div className="relative w-[312px] h-[200px] rounded-[12px] overflow-hidden">
        <Image src={cover} alt={title} fill className="object-cover" />
      </div>

      <h3 className="mt-3 line-clamp-3 font-rem text-[20px] leading-[26px] font-medium text-wasis-pr80">
        {title}
      </h3>

      <Link
        href={href}
        className={`
          inline-flex h-[40px] px-4 items-center justify-center rounded-[10px]
          bg-wasis-pr60 text-wasis-nt80 font-rem text-[16px] leading-5 font-medium
        `}
      >
        Tonton Video
      </Link>
    </article>
  );
}

export default function VideoSection({ items = [] }) {
  const railRef = useRef(null);

  return (
    <section
      className={`
        w-full rounded-t-[100px]
        bg-wasis-pr40
        shadow-[0_-6px_14px_-6px_rgba(24,39,75,.12),0_-10px_32px_-4px_rgba(24,39,75,.10)]
        pt-8 pb-12
      `}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4">
        <div className="mx-auto w-full max-w-[1320px] px-16">
          <div
            className={`
    relative overflow-hidden
    rounded-[100px] bg-white/10 backdrop-blur-md
    shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]
 outline-1 outline-white/40
    px-8 py-4
  `}
          >
            <div
              className={`
                pointer-events-none absolute inset-x-0 top-0 h-[40%]
                bg-gradient-to-b from-white/35 to-transparent
              `}
            />
            <h2 className="font-rem text-[36px] leading-[46px] font-bold text-wasis-pr00">
              Dokumentasi Video
            </h2>
            <p className="mt-1 font-rem text-[20px] leading-[26px] font-bold text-wasis-pr00">
              Cek highlight seru dari berbagai acara dan aktivitas WASIS. Semua
              momen terbaik, terekam di sini!
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div
            ref={railRef}
            className={`
              no-scrollbar
              mx-auto w-full max-w-[1440px]
              px-[60px]
              overflow-x-auto scroll-smooth
              snap-x snap-mandatory
            `}
            style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
          >
            <div className="flex min-w-max gap-6">
              {items.map((v, i) => (
                <div key={i} className="snap-start">
                  <VideoCard cover={v.cover} title={v.title} href={v.href} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
