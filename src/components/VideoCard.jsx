import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { API_BASE } from "@/lib/config";

export default function VideoCard({ item }) {
  let imageUrl;

  if (item.image) {
    const backendOrigin = API_BASE.replace("/api", "");
    imageUrl = `${backendOrigin}/storage/${item.image}`;
  }
  else if (item.thumbnail_url) {
    imageUrl = item.thumbnail_url;
  }
  else if (item.url || item.youtube_url || item.youtube_link) {
    const raw = item.url || item.youtube_url || item.youtube_link;
    const match = raw.match(
      /(?:youtube\.com.*[?&]v=|youtu\.be\/)([^"&?/ ]{11})/
    );
    if (match) {
      const videoId = match[1];
      imageUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }

  if (!imageUrl) {
    imageUrl = "/video/1.jpg";
  }

  const youtubeHref = item.youtube_url || item.youtube_link || item.url || "#";

  return (
    <div
      className="w-full max-w-[1200px] h-auto p-8
                 rounded-3xl border border-wasis-pr00 bg-wasis-nt80
                 shadow-[0_2px_4px_-2px_rgba(24,39,75,0.12),_0_4px_4px_-2px_rgba(24,39,75,0.08)]
                 flex flex-col gap-4"
    >
      <div className="w-full h-[307px] rounded-2xl overflow-hidden relative">
        <Image
          src={imageUrl}
          alt={item.title || "Video Dokumentasi"}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex flex-col items-start gap-3">
        <h2
          className="font-rem font-bold text-3xl text-wasis-pr80"
          style={{ lineHeight: "38px" }}
        >
          {item.title}
        </h2>

        <div className="flex items-center gap-2 text-gray-500">
          <Calendar className="w-4 h-4" />
          <span className="font-rem text-sm">
            {new Date(item.created_at || Date.now()).toLocaleDateString(
              "id-ID",
              { day: "numeric", month: "long", year: "numeric" }
            )}
          </span>
        </div>

        <Link
          href={youtubeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="h-7 px-3 rounded-lg bg-wasis-pr60 text-white flex items-center justify-center
                     text-sm font-medium hover:bg-wasis-pr80 transition-colors"
        >
          Tonton Video
        </Link>
      </div>
    </div>
  );
}
