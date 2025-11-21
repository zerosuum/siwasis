"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";
import { useToast } from "@/components/ui/useToast";
import { actionDeleteBerita } from "@/app/(public)/blog/actions";

export default function BlogCard({ item, canManage = false }) {
  const router = useRouter();
  const { show: toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    setPending(true);
    try {
      await actionDeleteBerita(item.id);

      toast({
        title: "Berita dihapus",
        description: "Berita berhasil dihapus.",
        variant: "success",
      });

      setConfirmOpen(false);
      router.refresh();
    } catch (e) {
      toast({
        title: "Gagal menghapus berita",
        description: e.message || "Terjadi kesalahan.",
        variant: "error",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <>
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

          <div className="mt-4 flex w-full items-center justify-between gap-3">
            <Link
              href={`/blog/${item.id || "#"}`}
              className="h-7 px-2 rounded-lg bg-wasis-pr60 text-white flex items-center text-sm font-medium"
            >
              Selengkapnya
            </Link>

            {canManage && (
              <div className="flex items-center gap-2">
                <Link
                  href={`/blog/${item.id}/edit`}
                  className="
                          h-7 px-3 rounded-lg bg-wasis-pr40 text-wasis-pr80 
                          flex items-center text-sm font-medium 
                          hover:bg-wasis-pr60 hover:text-white transition-all
                        "
                >
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => setConfirmOpen(true)}
                  className="
                        h-7 px-3 rounded-lg bg-red-200 text-red-700 
                        flex items-center text-sm font-medium 
                        hover:bg-red-300 transition-all
                      "
                                >
                  Hapus
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => !pending && setConfirmOpen(false)}
        >
          <div
            className="w-[360px] max-w-[90vw] bg-white rounded-2xl shadow-lg p-5 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-wasis-pr80">
              Hapus Berita
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Yakin ingin menghapus berita{" "}
              <span className="font-semibold">&quot;{item.title}&quot;</span>?
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="mt-5 flex gap-2 justify-end">
              <button
                onClick={() => !pending && setConfirmOpen(false)}
                className="h-9 px-4 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium"
                disabled={pending}
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="h-9 px-4 rounded-lg bg-red-600 text-white text-sm font-medium disabled:opacity-60"
                disabled={pending}
              >
                {pending ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
