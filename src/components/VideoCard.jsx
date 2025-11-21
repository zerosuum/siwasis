"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/config";
import { useToast } from "@/components/ui/useToast";
import {
  actionUpdateVideo,
  actionDeleteVideo,
} from "@/app/(public)/dokumentasi-video/actions";

export default function VideoCard({ item, canManage = false }) {
  const router = useRouter();
  const { show: toast } = useToast();
  
  let imageUrl;

  if (item.image) {
    const backendOrigin = API_BASE.replace("/api", "");
    imageUrl = `${backendOrigin}/storage/${item.image}`;
  } else if (item.thumbnail_url) {
    imageUrl = item.thumbnail_url;
  } else if (item.url || item.youtube_url || item.youtube_link) {
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

  const [editOpen, setEditOpen] = useState(false);
  const [title, setTitle] = useState(item.title || "");
  const [url, setUrl] = useState(
    item.url || item.youtube_url || item.youtube_link || ""
  );
  const [pending, setPending] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async () => {
    setPending(true);
    setError(null);

    try {
      await actionUpdateVideo({ id: item.id, title, url });

      toast({
        variant: "success",
        title: "Berhasil",
        description: "Video berhasil diperbarui.",
      });

      setEditOpen(false);
      router.refresh();
    } catch (e) {
      const msg = e.message || "Gagal memperbarui video.";
      setError(msg);
      toast({
        variant: "error",
        title: "Gagal memperbarui video",
        description: msg,
      });
    } finally {
      setPending(false);
    }
  };

  const handleDelete = async () => {
    setPending(true);
    try {
      await actionDeleteVideo(item.id);

      toast({
        variant: "success",
        title: "Video dihapus",
        description: "Video dokumentasi berhasil dihapus.",
      });

      setDeleteConfirmOpen(false);
      router.refresh();
    } catch (e) {
      const msg = e.message || "Gagal menghapus video.";
      toast({
        variant: "error",
        title: "Gagal menghapus video",
        description: msg,
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

          <div className="mt-2 flex w-full items-center justify-between gap-3">
            <Link
              href={youtubeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="h-7 px-2 rounded-lg bg-wasis-pr60 text-white flex items-center text-sm font-medium"
            >
              Tonton Video
            </Link>

            {canManage && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTitle(item.title || "");
                    setUrl(
                      item.url || item.youtube_url || item.youtube_link || ""
                    );
                    setError(null);
                    setEditOpen(true);
                  }}
                  className="
                          h-7 px-3 rounded-lg bg-wasis-pr40 text-wasis-pr80 
                          flex items-center text-sm font-medium 
                          hover:bg-wasis-pr60 hover:text-white transition-all
                        "
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(true)}
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

      {editOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => !pending && setEditOpen(false)}
        >
          <div
            className="w-[460px] max-w-[90vw] bg-white rounded-2xl shadow-lg p-6 flex flex-col animate-slide-up-and-fade"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold font-rem text-wasis-pr80">
              Edit Video
            </h3>

            <div className="flex flex-col gap-4 mt-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Judul *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul..."
                  className="w-full h-10 px-3 mt-1 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Link YouTube *
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full h-10 px-3 mt-1 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => !pending && setEditOpen(false)}
                className="flex-1 h-10 rounded-lg bg-gray-200 text-gray-700 font-semibold text-sm"
                disabled={pending}
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                disabled={pending || !title || !url}
                className="flex-1 h-10 rounded-lg bg-wasis-pr60 text-white font-semibold text-sm
                           disabled:opacity-50"
              >
                {pending ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => !pending && setDeleteConfirmOpen(false)}
        >
          <div
            className="w-[360px] max-w-[90vw] bg-white rounded-2xl shadow-lg p-5 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-wasis-pr80">
              Hapus Video
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Yakin ingin menghapus video{" "}
              <span className="font-semibold">&quot;{item.title}&quot;</span>?
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="mt-5 flex gap-2 justify-end">
              <button
                onClick={() => !pending && setDeleteConfirmOpen(false)}
                className="h-9 px-4 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium"
                disabled={pending}
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={pending}
                className="h-9 px-4 rounded-lg bg-red-600 text-white text-sm font-medium disabled:opacity-60"
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
