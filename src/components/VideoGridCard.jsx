"use client";
import Image from "next/image";
import Link from "next/link";

export default function VideoGridCard({ item }) {
  return (
    <div
      className="w-full h-[378px] flex-shrink-0 p-6 rounded-3xl bg-wasis-nt80
                 flex flex-col justify-between
                 shadow-[0_2px_4px_-2px_rgba(24,39,75,0.12),_0_4px_4px_-2px_rgba(24,39,75,0.08)]
                 transition hover:shadow-lg"
    >
      <div>
        <div className="w-full h-[200px] rounded-2xl overflow-hidden relative">
          <Image
            src={item.thumbnail_url || "/placeholder-video.jpg"}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>

        <h3
          className="mt-4 font-rem font-medium text-xl text-wasis-pr80 line-clamp-2"
          style={{ lineHeight: "26px" }}
        >
          {item.title}
        </h3>
      </div>

      <Link
        href={item.youtube_url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 px-4 justify-center items-center gap-1 
                   rounded-lg bg-wasis-pr60 text-wasis-nt80 
                   text-base font-medium font-rem w-full"
      >
        Tonton Video
      </Link>
    </div>
  );
}
