"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import SectionPill from "@/components/SectionPill";

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
      <div className="relative w-full aspect-video rounded-[12px] overflow-hidden">
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 360px"
        />
      </div>

      <div className="flex flex-col mt-3 flex-1">
        <h3 className="line-clamp-3 font-rem text-[20px] leading-[26px] font-medium text-wasis-pr80">
          {title}
        </h3>

        <div className="mt-auto">
          <Link
            href={href}
            className="inline-flex h-[40px] w-full px-4 items-center justify-center 
                   rounded-[10px] bg-wasis-pr60 text-wasis-nt80 
                   font-rem text-[16px] leading-5 font-medium"
          >
            Tonton Video
          </Link>
        </div>
      </div>
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
        <div className="mx-auto w-full max-w-[1320px] px-4 md:px-16">
          <SectionPill
            title="Dokumentasi Video"
            subtitle="Cek highlight seru dari berbagai acara dan aktivitas WASIS. Semua momen terbaik, terekam di sini!"
            titleClass="text-wasis-pr00"
            subtitleClass="text-wasis-pr00/90"
          />
        </div>

        <div className="mt-6">
          <div
            ref={railRef}
            className="no-scrollbar mx-auto w-full max-w-[1320px] px-4 md:px-16 overflow-x-auto scroll-smooth snap-x snap-mandatory"
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
