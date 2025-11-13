"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { actionCreateVideo } from "@/app/(public)/dokumentasi-video/actions";
import { useToast } from "@/components/ui/useToast";

function UploadVideoModal({ onClose }) {
  const router = useRouter();
  const { show: toast } = useToast(); 
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await actionCreateVideo({ title, url: youtubeUrl });

      toast({
        variant: "success",
        title: "Sukses!",
        description: "Video dokumentasi baru berhasil ditambahkan.",
      });

      onClose();
      router.refresh();
    } catch (e) {
      const msg = e.message || "Gagal menambahkan video.";
      setError(msg);

      toast({
        variant: "error",
        title: "Gagal menambahkan video",
        description: msg,
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[460px] max-w-[90vw] bg-white rounded-2xl shadow-lg p-6 flex flex-col animate-slide-up-and-fade"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h3 className="text-xl font-bold font-rem text-wasis-pr80">
          Unggah Video Baru
        </h3>

        <div className="flex flex-col gap-4 mt-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">Judul *</label>
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
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full h-10 px-3 mt-1 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-lg bg-gray-200 text-gray-700 font-semibold text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !title || !youtubeUrl}
            className="flex-1 h-10 rounded-lg bg-wasis-pr60 text-white font-semibold text-sm
                       flex items-center justify-center disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UploadVideoCTA({
  hideTrigger = true,
  eventName = "OPEN_UPLOAD_VIDEO",
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener(eventName, handler);
    return () => document.removeEventListener(eventName, handler);
  }, [eventName]);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open, mounted]);

  return (
    <>
      {!hideTrigger && (
        <button
          onClick={() => setOpen(true)}
          className="mt-3 inline-block text-wasis-nt80/90 text-base font-medium underline underline-offset-[6px]
                     decoration-wasis-nt80/40 hover:decoration-wasis-nt80 transition-all"
        >
          Unggah video baru
        </button>
      )}

      {mounted &&
        open &&
        createPortal(
          <UploadVideoModal onClose={() => setOpen(false)} />,
          document.body
        )}
    </>
  );
}
