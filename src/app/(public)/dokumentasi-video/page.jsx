import SectionPill from "@/components/SectionPill";
import { getAdminProfile } from "@/lib/session";
import { fetchFirstData } from "@/server/queries/_api";
import UploadVideoTrigger from "@/components/UploadVideoTrigger";
import UploadVideoCTA from "@/components/UploadVideoCTA";
import VideoCard from "@/components/VideoCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DokumentasiVideoPage() {
  const [profile, videoRaw] = await Promise.all([
    getAdminProfile(),
    fetchFirstData(["/youtube", "/videos"]),
  ]);

  const isLoggedIn = !!profile;
  const list = Array.isArray(videoRaw) ? videoRaw : [];

  return (
    <>
      <div className="w-full bg-wasis-pr40 rounded-b-massive shadow-[0_8px_28px_-6px_rgba(24,39,75,0.12),_0_18px_88px_-4px_rgba(24,39,75,0.14)]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-10">
          <div className="grid md:grid-cols-[12px_1fr]">
            <div className="hidden md:block" />
            <div className="w-full">
              <SectionPill
                title="Dokumentasi Video"
                subtitle="Kumpulan rekaman kegiatan dan momen penting WASIS yang bisa kamu tonton kembali kapan saja."
                className="w-full !max-w-none bg-transparent !border-0 !shadow-none p-0 text-center md:text-left"
                titleClass="text-wasis-nt80 text-2xl md:text-3xl font-rem font-bold"
                subtitleClass="text-wasis-nt80/90 mt-2"
              >
                {isLoggedIn && (
                  <div className="mt-4 flex justify-center md:justify-start">
                    <UploadVideoTrigger />
                  </div>
                )}
              </SectionPill>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-4 py-10 sm:py-12 flex flex-col items-center gap-8">
        {list.length > 0 ? (
          list.map((item) => <VideoCard key={item.id} item={item} canManage={isLoggedIn} />)
        ) : (
          <p className="text-gray-500 text-center py-24">
            Belum ada video untuk ditampilkan.
          </p>
        )}
      </div>

      <UploadVideoCTA />
    </>
  );
}
