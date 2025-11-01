import { getAdminProfile } from "@/lib/session";
import { API_BASE } from "@/server/queries/_api";
import Link from "next/link";
import Image from "next/image";
import { User, Library, HandCoins, UserCheck } from "lucide-react";
import HeroEditableModal from "@/components/HeroEditableModal";
import SectionPill from "@/components/SectionPill";
import BeritaCarousel from "@/components/BeritaCarousel"; // Import Carousel
import VideoSection from "@/components/VideoSection";

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

// Komponen Card Pengurus (dibuat responsif)
function PengurusCard({ role, name, icon }) {
  return (
    // FIX: Hapus 'w-[423px]' agar bisa responsif
    <div className="h-[124px] rounded-[24px] bg-wasis-pr40 border border-white/20 shadow-card flex items-center gap-4 px-6">
      <img src={icon} alt={role} width={96} height={96} className="shrink-0" />
      <div className="min-w-0">
        <p className="text-wasis-nt80/80 font-rem text-lg md:text-[20px] leading-[26px]">
          {role}
        </p>
        <p className="text-wasis-nt80 font-rem font-bold text-2xl md:text-[28px] leading-[32px] truncate">
          {name}
        </p>
      </div>
    </div>
  );
}

const roleIcons = {
  ketua: <User size={32} className="text-wasis-nt80" />,
  wakil: <UserCheck size={32} className="text-wasis-nt80" />,
  sekretaris: <Library size={32} className="text-wasis-nt80" />,
  bendahara: <HandCoins size={32} className="text-wasis-nt80" />,
  warga: <User size={32} className="text-wasis-nt80" />,
};

export default async function HomePage() {
  const [profile, pengurus, berita, video] = await Promise.all([
    getAdminProfile(),
    fetchData("/pengurus"),
    fetchData("/berita?limit=5"),
    fetchData("/video?limit=5"),
  ]);

  const isAdmin = !!profile;

  return (
    <div className="w-full overflow-x-hidden">
      <section className="relative w-full min-h-[calc(100vh-72px)] pt-[72px] flex items-center">
        <Image
          src="/hero-background.jpg"
          alt="Hero Siwasis"
          fill
          className="z-0 object-cover object-[0px_-183px]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,.45)] via-[rgba(0,0,0,.35)] to-[rgba(0,0,0,.35)]" />

        <HeroEditableModal
          isAdmin={isAdmin}
          currentImage="/hero-background.jpg"
        />

        <div className="relative z-10 w-full">
          <div className="max-w-[1440px] mx-auto px-4">
            <div className="ml-auto max-w-3xl pt-[1vh] pb-[16vh] text-right">
              <h1
                className="font-rem font-bold text-6xl text-wasis-nt80"
                style={{ lineHeight: "74px" }}
              >
                Selamat datang di SiWASIS!
              </h1>

              <p
                className="font-rem text-lg text-wasis-nt80/90 mt-6 whitespace-pre-line"
                style={{ lineHeight: "27px" }}
              >
                {`Ruang bagi pemuda/i Desa Siwalan Sentolo untuk
berkarya, menyuarakan aspirasi,
dan bergerak bersama.`}
              </p>

              <p
                className="font-rem text-lg text-wasis-nt80/90 mt-6 whitespace-pre-line"
                style={{ lineHeight: "27px" }}
              >
                {`Dengan semangat gotong royong, inovasi, dan kolaborasi,
kami siap mendorong lahirnya perubahan menuju desa
yang mandiri, sejahtera, dan berbudaya.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-40 w-full">
        <div className="h-[360px] bg-wasis-pr40 rounded-b-massive shadow-[0_8px_28px_-6px_rgba(24,39,75,0.12),_0_18px_88px_-4px_rgba(24,39,75,0.14)]" />

        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-[1320px] px-4 z-10">
          <div className="rounded-massive overflow-hidden backdrop-blur-md bg-white/10 border border-white/30 shadow-[0_8px_28px_-6px_rgba(24,39,75,0.12),_0_18px_88px_-4px_rgba(24,39,75,0.14)]">
            <div className="p-8 md:p-10 space-y-4">
              <h2
                className="text-center font-rem font-bold text-4xl text-wasis-nt80"
                style={{ lineHeight: "46px" }}
              >
                Visi
              </h2>
              <p
                className="text-center font-rem font-medium text-xl text-wasis-nt80"
                style={{ lineHeight: "26px" }}
              >
                Mewujudkan Pemuda Desa Siwalan Sentolo yang Inovatif, Mandiri,
                dan Berbudaya sebagai Garda Terdepan Pembangunan Desa
                Berkelanjutan.
              </p>

              <h3
                className="text-center font-rem font-bold text-3xl text-wasis-nt80 mt-2"
                style={{ lineHeight: "38px" }}
              >
                Misi
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-wasis-nt80/95 text-[15px] leading-6">
                <p>
                  <span className="font-bold">Mengembangkan Potensi:</span>{" "}
                  Meningkatkan kapasitas dan keterampilan pemuda dalam berbagai
                  bidang.
                </p>
                <p>
                  <span className="font-bold">Mendorong Partisipasi:</span>{" "}
                  Aktif berkontribusi dalam perencanaan dan pelaksanaan program
                  pembangunan.
                </p>
                <p>
                  <span className="font-bold">Melestarikan Budaya:</span>{" "}
                  Menjaga dan mempromosikan nilai-nilai budaya serta tradisi
                  desa.
                </p>
                <p>
                  <span className="font-bold">Memperkuat Jaringan:</span>{" "}
                  Membangun kemitraan strategis dengan pemerintah desa dan
                  komunitas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full">
        <div className="max-w-[1320px] mx-auto px-16 py-24">
          <SectionPill
            title="Pengurus Harian"
            subtitle="Tim utama yang memimpin dan menggerakkan setiap kegiatan WASIS dengan penuh semangat, tanggung jawab, dan dedikasi."
          />

          <div className="mt-12 w-full flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <PengurusCard
                role="Ketua"
                name="Fajar Pratama"
                icon="/icons/ketua.svg"
              />
              <PengurusCard
                role="Wakil Ketua"
                name="Rizky Ananda"
                icon="/icons/wakil.svg"
              />
              <PengurusCard
                role="Sekretaris"
                name="Dewi Lestari"
                icon="/icons/sekretaris.svg"
              />
              <PengurusCard
                role="Bendahara"
                name="Sinta Rahma"
                icon="/icons/bendahara.svg"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="w-full">
        <div className="max-w-[1320px] mx-auto px-16 pb-24">
          <SectionPill
            title="Berita Terkini"
            subtitle="Ikuti perkembangan terbaru dari Desa Siwalan. Temukan kabar, pengumuman, dan informasi penting yang selalu kami perbarui untuk Anda."
            className="mb-6"
          >
            <a
              href="/blog"
              className="mt-4 inline-flex h-7 px-3 items-center rounded-lg bg-wasis-pr60 text-wasis-nt80 text-sm font-semibold"
            >
              Lihat seluruh berita
            </a>
          </SectionPill>
          <BeritaCarousel dense berita={berita} />
        </div>
      </section>
      <VideoSection
        items={[
          {
            cover: "/video/1.jpg",
            title:
              "Dokumentasi Peringatan Hari Kemerdekaan ke-80 Republik Indonesia",
            href: "/video/1",
          },
          {
            cover: "/video/2.jpg",
            title: "Dokumentasi Kerja Bakti Pembangunan Pos Kamling Baru",
            href: "/video/2",
          },
          {
            cover: "/video/3.jpg",
            title:
              "Dokumentasi Kegiatan Senam Pagi Bersama Warga Siwalan - Sentolo",
            href: "/video/3",
          },
          {
            cover: "/video/4.jpg",
            title:
              "Dokumentasi Kajian dan Buka Bersama Warga Siwalan – Sentolo",
            href: "/video/4",
          },
        ]}
      />
    </div>
  );
}
