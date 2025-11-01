import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default function BlogCard({ item }) {
  return (
    <div
      className="w-full max-w-[1200px] h-auto p-8 
                 rounded-3xl border border-wasis-pr00 bg-wasis-nt80
                 shadow-[0_2px_4px_-2px_rgba(24,39,75,0.12),_0_4px_4px_-2px_rgba(24,39,75,0.08)]
                 flex flex-col gap-4"
    >
      <div className="w-full h-[307px] rounded-2xl overflow-hidden relative">
        <Image
          src={item.image_url || "/placeholder-berita.jpg"}
          alt={item.title || "Berita"}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col items-start gap-3">
        <h2
          className="font-rem font-bold text-3xl text-wasis-pr80"
          style={{ lineHeight: "38px" }}
        >
          {item.title || "Judul Berita"}
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

        <p
          className="font-rem text-lg text-wasis-pr80/90"
          style={{ lineHeight: "27px" }}
        >
          {item.excerpt ||
            "Aksi nyata Gotong Royong yang luar biasa! Para pemuda/i desa menggandeng tokoh masyarakat dan warga setempat untuk berkolaborasi membersihkan sungai..."}
        </p>

        <Link
          href={`/blog/${item.id || "#"}`}
          className="h-7 px-2 rounded-lg bg-wasis-pr60 text-white flex items-center text-sm font-medium"
        >
          Selengkapnya
        </Link>
      </div>
    </div>
  );
}
