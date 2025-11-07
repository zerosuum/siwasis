import { fetchData } from "@/server/queries/_api";
import { getAdminProfile } from "@/lib/session";
import VideoCard from "@/components/VideoCard";
import SectionPill from "@/components/SectionPill";
import UploadVideoTrigger from "@/components/UploadVideoTrigger";
import UploadVideoCTA from "@/components/UploadVideoCTA";

export default async function DokumentasiVideoPage() {
  const [profile, videos] = await Promise.all([
    getAdminProfile(),
    fetchData("/video"),
  ]);
  const isLoggedIn = !!profile;

  return (
    <div className="w-full relative">
      <div className="w-full bg-wasis-pr40 rounded-b-massive shadow-[0_8px_28px_-6px_rgba(24,39,75,0.12),_0_18px_88px_-4px_rgba(24,39,75,0.14)]">
        <div className="w-full max-w-[1440px] mx-auto px-4 py-8">
          <div className="grid grid-cols-[12px_1fr]">
            <div />
            <div className="w-full">
              <SectionPill
                title="Dokumentasi Video"
                subtitle="Cek highlight seru dari berbagai acara dan aktivitas WASIS. Semua momen terbaik, terekam di sini!"
                className="w-full bg-transparent !border-0 !shadow-none p-0"
                titleClass="text-wasis-nt80"
                subtitleClass="text-wasis-nt80/90"
              >
                {isLoggedIn && <UploadVideoTrigger />}{" "}
              </SectionPill>
            </div>
          </div>
        </div>
      </div>
      {isLoggedIn && <UploadVideoCTA hideTrigger />}

      <div className="w-full max-w-[1440px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1320px] mx-auto px-4 sm:px-16">
          {Array.isArray(videos) && videos.length ? (
            videos.map((item) => <VideoCard key={item.id} item={item} />)
          ) : (
            <p className="text-gray-500 col-span-full text-center py-24">
              Belum ada video untuk ditampilkan.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
