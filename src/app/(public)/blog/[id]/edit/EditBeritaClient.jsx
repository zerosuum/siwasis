"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ImageUp, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/useToast";
import { actionUpdateBerita } from "../../actions";

const TextEditor = dynamic(() => import("@/components/TextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-400">
      Memuat editor...
    </div>
  ),
});

function FotoModal({ onClose, onUpload, isUploading, initialPreview }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialPreview || null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSimpan = () => {
    if (file) {
      onUpload(file, preview);
    } else {
      onClose();
    }
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
          Ubah Foto Sampul
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Pilih foto baru untuk sampul berita.
        </p>

        <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg mt-4 flex flex-col items-center justify-center text-gray-500">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <ImageUp size={48} className="text-gray-400" />
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm mt-4"
        />

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-lg bg-gray-200 text-gray-700 font-semibold text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleSimpan}
            disabled={isUploading}
            className="flex-1 h-10 rounded-lg bg-wasis-pr60 text-white font-semibold text-sm flex items-center justify-center disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="animate-spin" /> : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditBeritaClient({ initial }) {
  const router = useRouter();
  const { show: toast } = useToast();

  const [title, setTitle] = useState(initial.title || "");
  const [content, setContent] = useState(initial.content || "");
  const [isFotoModalOpen, setIsFotoModalOpen] = useState(false);
  const [fotoUrl, setFotoUrl] = useState(initial.image_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);

  const handleUploadFoto = async (newFile, previewUrl) => {
    setIsUploading(true);
    await new Promise((res) => setTimeout(res, 400));
    setFotoUrl(previewUrl);
    setFile(newFile);
    setIsUploading(false);
    setIsFotoModalOpen(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("title", title);
      formData.append("content", content);
      if (file) {
        formData.append("image", file);
      }

      await actionUpdateBerita(initial.id, formData);

      toast({
        title: "Berhasil",
        description: "Berita berhasil diperbarui.",
        variant: "success",
      });

      router.push(`/blog/${initial.id}`);
    } catch (e) {
      toast({
        title: "Gagal memperbarui berita",
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
            Edit Berita
          </h1>
          <p
            className="font-rem 
                 text-sm sm:text-base lg:text-lg 
                 text-wasis-nt80/90 
                 mt-2 max-w-2xl"
            style={{ lineHeight: "1.5" }}
          >
            Perbarui judul, isi, atau foto sampul berita.
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
                type="button"
                onClick={() => router.back()}
                className="h-10 px-6 rounded-lg bg-gray-200 text-gray-700 font-semibold text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !title || content.length < 10}
                className="h-10 px-6 rounded-lg bg-wasis-pr60 text-white font-semibold text-sm flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Simpan"}
              </button>
            </div>
          </div>
        </div>

        {isFotoModalOpen && (
          <FotoModal
            onClose={() => setIsFotoModalOpen(false)}
            onUpload={handleUploadFoto}
            isUploading={isUploading}
            initialPreview={fotoUrl}
          />
        )}
      </div>
    </>
  );
}
