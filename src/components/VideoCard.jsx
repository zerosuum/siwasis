import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default function VideoCard({ item }) {
  return (
    <div
      className="w-full max-w-[1200px] h-auto p-8
                 rounded-3xl border border-wasis-pr00 bg-wasis-nt80
                 shadow-[0_2px_4px_-2px_rgba(24,39,75,0.12),_0_4px_4px_-2px_rgba(24,39,75,0.08)]
                 flex flex-col gap-4"
    >
      <div className="w-full h-[307px] rounded-2xl overflow-hidden relative">
        <Image
          src={item.thumbnail_url || item.image_url || "/default-video.jpg"}
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
          href={item.youtube_link}
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
