"use client";

import Image from "next/image";
import Link from "next/link";

export default function NewsCard({ item }) {
  const {
    slug = "#",
    title = "",
    date = "",
    thumbnail = "/placeholder.jpg",
    excerpt = "",
  } = item || {};

  return (
    <article
      className="
        snap-center shrink-0 w-[340px]
        bg-white rounded-[24px] border border-[rgba(0,0,0,0.06)]
        shadow-[0_8px_24px_rgba(0,0,0,0.08)]
        overflow-hidden
      "
    >
      <div className="relative w-full h-[220px]">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
          sizes="340px"
          priority={false}
        />
      </div>

      <div className="p-5 space-y-3">
        <h3 className="font-rem font-bold text-[20px] leading-[26px] text-wasis-pr80">
          {title}
        </h3>

        {excerpt ? (
          <p className="text-[14px] leading-5 text-wasis-pr80/80 line-clamp-2">
            {excerpt}
          </p>
        ) : null}

        <div className="flex items-center justify-between pt-1">
          <div className="text-[13px] text-wasis-pr80/70">{date}</div>
          <Link
            href={`/blog/${slug}`}
            className="inline-flex h-7 px-3 items-center rounded-lg
                       bg-wasis-pr60 text-wasis-nt80 text-sm font-semibold"
          >
            Selengkapnya
          </Link>
        </div>
      </div>
    </article>
  );
}
