import { getAdminProfile } from "@/lib/session";
import { API_BASE } from "@/server/queries/_api";
import VideoCard from "@/components/VideoCard";
import UploadVideoCTA from "@/components/UploadVideoCTA";

async function fetchData(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.rows || data;
  } catch {
    return [];
  }
}

export default async function DokumentasiVideoPage() {
  const [profile, videos] = await Promise.all([
    getAdminProfile(),
    fetchData("/video"),
  ]);
  const isLoggedIn = !!profile;

  return (
    <div className="w-full">
      <div className="w-full bg-wasis-pr40 rounded-b-massive shadow-[0_8px_28px_-6px_rgba(24,39,75,0.12),_0_18px_88px_-4px_rgba(24,39,75,0.14)]">
        <div className="w-full max-w-[1440px] mx-auto px-4 py-8">
          <div className="grid grid-cols-[12px_1fr]">
            <div /> { }
            <div className="w-full">
              <h2 className="font-rem font-bold text-[32px] leading-[38px] text-wasis-nt80">
                Dokumentasi Video
              </h2>
              <p className="mt-2 text-wasis-nt80/90">
                Cek highlight seru dari berbagai acara dan aktivitas WASIS.
                Semua momen terbaik, terekam di sini!
              </p>

              {isLoggedIn && <UploadVideoCTA />}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-4 py-12">
        <div className="grid grid-cols-[12px_1fr]">
          <div /> { }
          <div className="w-full flex flex-col items-center gap-8">
            {Array.isArray(videos) && videos.length ? (
              videos.map((item) => <VideoCard key={item.id} item={item} />)
            ) : (
              <p className="text-gray-500 text-center py-24">
                Belum ada video untuk ditampilkan.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
