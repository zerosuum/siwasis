"use client";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default function VideoGridCard({ item }) {
  let imageUrl =
    item.thumbnail_url || item.image_url || "/placeholder-video.jpg";

  if (imageUrl.includes("maxresdefault.jpg")) {
    imageUrl = imageUrl.replace("maxresdefault.jpg", "hqdefault.jpg");
  }

  const createdAt =
    item.published_at || item.created_at || item.uploaded_at || Date.now();

  return (
    <div
      className="w-full flex-shrink-0 p-6 rounded-3xl bg-wasis-nt80
                 flex flex-col justify-between gap-3
                 shadow-[0_2px_4px_-2px_rgba(24,39,75,0.12),_0_4px_4px_-2px_rgba(24,39,75,0.08)]
                 transition hover:shadow-lg"
    >
      <div>
        <div className="w-full aspect-video rounded-2xl overflow-hidden relative">
          <Image
            src={imageUrl}
            alt={item.title || "Video Dokumentasi"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <h3
          className="mt-4 font-rem font-bold text-xl text-wasis-pr80 line-clamp-2"
          style={{ lineHeight: "26px" }}
        >
          {item.title || "Judul Video"}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-gray-500">
          <Calendar className="w-4 h-4" />
          <span className="font-rem text-sm">
            {new Date(createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <Link
        href={item.youtube_url || item.youtube_link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 px-4 mt-4 justify-center items-center gap-1 
                   rounded-lg bg-wasis-pr60 text-wasis-nt80 
                   text-base font-medium font-rem w-full"
      >
        Tonton Video
      </Link>
    </div>
  );
}
