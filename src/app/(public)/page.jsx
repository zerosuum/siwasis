import { getAdminProfile } from "@/lib/session";
import { API_BASE } from "@/lib/config";
import Link from "next/link";
import Image from "next/image";
import { User, Library, HandCoins, UserCheck } from "lucide-react";
import HeroEditableModal from "@/components/HeroEditableModal";
import SectionPill from "@/components/SectionPill";
import BeritaCarousel from "@/components/BeritaCarousel";
import VideoSection from "@/components/VideoSection";
import { fetchFirstData } from "@/server/queries/_api";
import { normalizeArticleList } from "@/lib/articles";
import { normalizeYoutubeList } from "@/lib/videos";

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

function VisiMisiContent() {
  return (
    <div className="px-6 md:px-10 pt-8 pb-10 md:pt-10 md:pb-12 space-y-6">
      <h2
        className="text-center font-rem font-bold text-3xl md:text-4xl text-wasis-nt80"
        style={{ lineHeight: "1.2" }}
      >
        Visi
      </h2>
      <p
        className="text-center font-rem font-medium text-lg md:text-xl text-wasis-nt80 max-w-3xl mx-auto"
        style={{ lineHeight: "1.5" }}
      >
        Mewujudkan Pemuda Desa Siwalan Sentolo yang Inovatif, Mandiri, dan
        Berbudaya sebagai Garda Terdepan Pembangunan Desa Berkelanjutan.
      </p>

      <h3
        className="text-center font-rem font-bold text-2xl md:text-3xl text-wasis-nt80 pt-4"
        style={{ lineHeight: "1.2" }}
      >
        Misi
      </h3>

      <div
        className="
          mt-4 max-w-5xl mx-auto
          grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4
          gap-5
          text-left text-wasis-nt80/95 text-[15px] leading-7
        "
      >
        <p className="md:pr-3">
          <span className="font-bold">Mengembangkan Potensi:</span> Meningkatkan
          kapasitas dan keterampilan pemuda dalam berbagai bidang.
        </p>
        <p className="md:pr-3">
          <span className="font-bold">Mendorong Partisipasi:</span> Aktif
          berkontribusi dalam perencanaan dan pelaksanaan program pembangunan.
        </p>
        <p className="md:pr-3">
          <span className="font-bold">Melestarikan Budaya:</span> Menjaga dan
          mempromosikan nilai-nilai budaya serta tradisi desa.
        </p>
        <p className="md:pr-3">
          <span className="font-bold">Memperkuat Jaringan:</span> Membangun
          kemitraan strategis dengan pemerintah desa dan komunitas.
        </p>
      </div>
    </div>
  );
}

function PengurusCard({ role, name, icon }) {
  return (
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

function mapPengurusHarian(list) {
  if (!Array.isArray(list)) return {};

  const normalize = (p) =>
    (p.jabatan || p.role || "").toLowerCase().replace(/\s+/g, "_");

  const findExact = (target) => list.find((p) => normalize(p) === target);

  const findIncludes = (keyword) =>
    list.find((p) => normalize(p).includes(keyword));

  const ketua = findExact("ketua") || findIncludes("ketua");

  const wakil = findExact("wakil_ketua") || findIncludes("wakil");

  const sekretaris = findExact("sekretaris") || findIncludes("sekretaris");

  const bendahara = findExact("bendahara") || findIncludes("bendahara");

  return { ketua, wakil, sekretaris, bendahara };
}

export default async function HomePage() {
  const [profile, pengurus, beritaRaw, video] = await Promise.all([
    getAdminProfile(),
    fetchFirstData("/pengurus"),
    fetchFirstData("/articles?limit=5"),
    fetchFirstData(["/youtube?limit=5"]),
  ]);

  const isAdmin = !!profile;

  const beritaListRaw =
    Array.isArray(beritaRaw) && beritaRaw.length ? beritaRaw : [];

  const beritaNormalized = normalizeArticleList(beritaListRaw);

  const beritaLimited =
    beritaNormalized && beritaNormalized.length
      ? [...beritaNormalized]
          .sort(
            (a, b) =>
              new Date(b.created_at || b.updated_at || 0) -
              new Date(a.created_at || a.updated_at || 0)
          )
          .slice(0, 5)
      : [];

  const berita = beritaLimited.length
    ? beritaLimited
    : [
        {
          id: "d1",
          title: "Pembangunan Pos Kamling Baru Rampung",
          created_at: "2025-08-21",
          image_url: "/sample/news-1.jpg",
        },
        {
          id: "d2",
          title: "Kerja Bakti Bulanan: Sungai Lebih Bersih",
          created_at: "2025-09-05",
          image_url: "/sample/news-2.jpg",
        },
        {
          id: "d3",
          title: "Festival Budaya Desa: Antusias Warga Tinggi",
          created_at: "2025-10-12",
          image_url: "/sample/news-3.jpg",
        },
      ];

  const { ketua, wakil, sekretaris, bendahara } = mapPengurusHarian(
    pengurus || []
  );

  const pengurusCards = {
    ketua: {
      role: "Ketua",
      name: ketua?.nama ?? "Belum diatur",
      icon: "/icons/ketua.svg",
    },
    wakil: {
      role: "Wakil Ketua",
      name: wakil?.nama ?? "Belum diatur",
      icon: "/icons/wakil.svg",
    },
    sekretaris: {
      role: "Sekretaris",
      name: sekretaris?.nama ?? "Belum diatur",
      icon: "/icons/sekretaris.svg",
    },
    bendahara: {
      role: "Bendahara",
      name: bendahara?.nama ?? "Belum diatur",
      icon: "/icons/bendahara.svg",
    },
  };

  const videoNormalized = normalizeYoutubeList(video);

  const videoLimited =
    videoNormalized && videoNormalized.length
      ? [...videoNormalized]
          .sort(
            (a, b) =>
              new Date(b.created_at || b.updated_at || 0) -
              new Date(a.created_at || a.updated_at || 0)
          )
          .slice(0, 5)
      : [];

  const videoItems = videoLimited.length
    ? videoLimited.map((v) => ({
        cover: v.thumbnail_url,
        title: v.title,
        href: v.youtube_url,
      }))
    : [
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
          title: "Dokumentasi Kajian dan Buka Bersama Warga Siwalan – Sentolo",
          href: "/video/4",
        },
      ];

  return (
    <div className="w-full overflow-x-hidden">
      <section className="relative w-full min-h-[90vh] pt-[72px] flex items-center pb-32">
        <Image
          src="/hero-background.jpg"
          alt="Hero Siwasis"
          fill
          className="z-0 object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,.45)] via-[rgba(0,0,0,.35)] to-[rgba(0,0,0,.35)]" />

        <HeroEditableModal
          isAdmin={isAdmin}
          currentImage="/hero-background.jpg"
        />

        <div className="relative z-10 w-full">
          <div className="w-full max-w-[1440px] mx-auto px-6 md:px-4">
            <div className="max-w-3xl text-center md:ml-auto md:text-right">
              <h1
                className="font-rem font-bold text-4xl md:text-6xl text-wasis-nt80"
                style={{ lineHeight: "1.2" }}
              >
                Selamat datang di SiWASIS!
              </h1>

              <p
                className="font-rem text-base md:text-lg text-wasis-nt80/90 mt-6 whitespace-pre-line"
                style={{ lineHeight: "1.5" }}
              >
                {`Ruang bagi pemuda/i Desa Siwalan Sentolo untuk
berkarya, menyuarakan aspirasi, dan bergerak bersama.`}
              </p>
              <p
                className="font-rem text-base md:text-lg text-wasis-nt80/90 mt-6 whitespace-pre-line"
                style={{ lineHeight: "1.5" }}
              >
                {`Dengan semangat gotong royong, inovasi, dan kolaborasi,
kami siap mendorong lahirnya perubahan menuju desa
yang mandiri, sejahtera, dan berbudaya.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-40 w-full -mt-24 md:hidden">
        <div className="bg-wasis-pr40 rounded-b-massive shadow-lg pt-24 pb-24">
          <div className="w-full max-w-[1320px] mx-auto px-4 z-10">
            <div className="rounded-massive overflow-hidden backdrop-blur-md bg-white/10 border border-white/30 shadow-lg">
              <VisiMisiContent />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-40 w-full hidden md:block">
        <div className="h-[360px] bg-wasis-pr40 rounded-b-massive shadow-[0_8px_28px_-6px_rgba(24,39,75,0.12),_0_18px_88px_-4px_rgba(24,39,75,0.14)]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-[1320px] px-4 z-10">
          <div className="rounded-massive overflow-hidden backdrop-blur-md bg-white/10 border border-white/30 shadow-[0_8px_28px_-6px_rgba(24,39,75,0.12),_0_18px_88px_-4px_rgba(24,39,75,0.14)]">
            <VisiMisiContent />
          </div>
        </div>
      </section>

      <section className="w-full overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-4 md:px-16 py-16 md:py-24">
          <SectionPill
            title="Pengurus Harian"
            subtitle="Tim utama yang memimpin dan menggerakkan setiap kegiatan WASIS dengan penuh semangat, tanggung jawab, dan dedikasi."
          />
          <div className="mt-12 w-full flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <PengurusCard
                role={pengurusCards.ketua.role}
                name={pengurusCards.ketua.name}
                icon={pengurusCards.ketua.icon}
              />
              <PengurusCard
                role={pengurusCards.wakil.role}
                name={pengurusCards.wakil.name}
                icon={pengurusCards.wakil.icon}
              />
              <PengurusCard
                role={pengurusCards.sekretaris.role}
                name={pengurusCards.sekretaris.name}
                icon={pengurusCards.sekretaris.icon}
              />
              <PengurusCard
                role={pengurusCards.bendahara.role}
                name={pengurusCards.bendahara.name}
                icon={pengurusCards.bendahara.icon}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="max-w-[1320px] mx-auto px-4 md:px-16 pb-0">
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
        </div>
      </section>

      <section className="w-full overflow-hidden pb-16 md:pb-24">
        <BeritaCarousel dense berita={berita} />
      </section>

      <VideoSection items={videoItems} />
    </div>
  );
}
