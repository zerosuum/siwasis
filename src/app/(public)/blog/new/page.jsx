"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/useToast";
import dynamic from "next/dynamic";
import { actionCreateBerita } from "../actions";
import { ImageUp, Loader2 } from "lucide-react";
import ImageDropzone from "@/components/ImageDropzone";

const TextEditor = dynamic(() => import("@/components/TextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-400">
      Memuat editor...
    </div>
  ),
});
function FotoModal({ onClose, onUpload, isUploading }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleSimpan = () => {
    if (file) onUpload(file, preview);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[460px] max-w-[90vw] bg-white rounded-2xl shadow-modal p-6 flex flex-col animate-slide-up-and-fade"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold font-rem text-wasis-pr80">
          Tambahkan Foto
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Pilih foto sampul untuk beritamu.
        </p>

        <div className="mt-4">
          <ImageDropzone
            initialUrl={preview || undefined}
            onChange={(f, url) => {
              setFile(f);
              setPreview(url);
            }}
            aspect="16/9"
            labelIdle="Klik atau drag foto sampul ke sini"
          />
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-lg bg-gray-200 text-gray-700 font-semibold text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleSimpan}
            disabled={!file || isUploading}
            className="flex-1 h-10 rounded-lg bg-wasis-pr60 text-white font-semibold text-sm flex items-center justify-center disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="animate-spin" /> : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TulisBeritaPage() {
  const router = useRouter();
  const { show: toast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isFotoModalOpen, setIsFotoModalOpen] = useState(false);
  const [fotoUrl, setFotoUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);

  const handleUploadFoto = async (file, previewUrl) => {
    setIsUploading(true);
    await new Promise((res) => setTimeout(res, 1000));
    setFotoUrl(previewUrl);
    setFile(file);
    setIsUploading(false);
    setIsFotoModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "Foto belum dipilih",
        description: "Silakan pilih foto sampul sebelum mengunggah berita.",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("image_path", file);

      await actionCreateBerita(formData);

      toast({
        title: "Berhasil",
        description: "Berita berhasil diunggah.",
        variant: "success",
      });

      router.push("/blog");
    } catch (e) {
      toast({
        title: "Gagal mengunggah berita",
        description: e.message || "Terjadi kesalahan.",
        variant: "error",
      });
      setIsSubmitting(false);
    }
  };

  const wordCount = useMemo(() => {
    if (!content) return 0;
    return content
      .replace(/<(.|\n)*?>/g, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  }, [content]);

  return (
    <>
      <div
        className="w-full bg-wasis-pr40 
                rounded-b-[40px] sm:rounded-b-[56px] lg:rounded-b-massive 
                shadow-[0_8px_28px_-6px_rgba(24,39,75,0.12),_0_18px_88px_-4px_rgba(24,39,75,0.14)]"
      >
        <div
          className="w-full max-w-[1320px] mx-auto 
                  px-4 sm:px-6 lg:px-10 
                  py-6 sm:py-8 lg:py-10"
        >
          <h1
            className="font-rem font-bold 
                 text-2xl sm:text-3xl lg:text-4xl 
                 text-wasis-nt80"
            style={{ lineHeight: "1.3" }}
          >
            Tulis Berita Baru
          </h1>
          <p
            className="font-rem 
                 text-sm sm:text-base lg:text-lg 
                 text-wasis-nt80/90 
                 mt-2 max-w-2xl"
            style={{ lineHeight: "1.5" }}
          >
            Bagikan informasi, pengumuman, atau cerita baru.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-4">
          {fotoUrl && (
            <div className="mb-4">
              <img
                src={fotoUrl}
                alt="Foto Sampul"
                className="w-full h-[300px] object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          <input
            type="text"
            placeholder="Tulis Judul Berita di Sini..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 sm:p-4 
             text-xl sm:text-2xl lg:text-3xl 
             font-bold font-rem 
             border-b-2 border-gray-200 
             focus:border-wasis-pr60 outline-none bg-transparent"
          />

          <TextEditor
            value={content}
            onChange={setContent}
            onOpenFotoModal={() => setIsFotoModalOpen(true)}
          />

          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500">{wordCount} kata</span>
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !title || content.length < 10}
                className="h-10 px-6 rounded-lg bg-wasis-pr60 text-white font-semibold text-sm flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Unggah"}
              </button>
            </div>
          </div>
        </div>

        {isFotoModalOpen && (
          <FotoModal
            onClose={() => setIsFotoModalOpen(false)}
            onUpload={handleUploadFoto}
            isUploading={isUploading}
          />
        )}
      </div>
    </>
  );
}
