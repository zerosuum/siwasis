"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/useToast";
import dynamic from "next/dynamic";
import { actionCreateBerita } from "../actions";
import { ImageUp, Loader2 } from "lucide-react";

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
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[460px] max-w-[90vw] bg-white rounded-2xl shadow-modal p-6
                   flex flex-col animate-slide-up-and-fade"
        onClick={(e) => e.stopPropagation()} 
      >
        <h3 className="text-xl font-bold font-rem text-wasis-pr80">
          Tambahkan Foto
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Pilih foto sampul untuk beritamu.
        </p>

        <div
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg mt-4
                        flex flex-col items-center justify-center text-gray-500"
        >
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
            disabled={!file || isUploading}
            className="flex-1 h-10 rounded-lg bg-wasis-pr60 text-white font-semibold text-sm
                       flex items-center justify-center disabled:opacity-50"
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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isFotoModalOpen, setIsFotoModalOpen] = useState(false);
  const [fotoUrl, setFotoUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUploadFoto = async (file, previewUrl) => {
    setIsUploading(true);
    await new Promise((res) => setTimeout(res, 1000));
    setFotoUrl(previewUrl);
    setIsUploading(false);
    setIsFotoModalOpen(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await actionCreateBerita({ title, content, imageUrl: fotoUrl });
      alert("Berita berhasil diunggah!");
      router.push("/blog");
    } catch (e) {
      alert("Gagal: " + e.message);
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
      <div className="w-full bg-wasis-pr40 rounded-b-massive shadow-lg">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-16 py-8">
          <h1
            className="font-rem font-bold text-4xl text-wasis-nt80"
            style={{ lineHeight: "46px" }}
          >
            Tulis Berita Baru
          </h1>
          <p
            className="font-rem text-xl text-wasis-nt80/90 mt-2"
            style={{ lineHeight: "26px" }}
          >
            Bagikan informasi, pengumuman, atau cerita baru.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-12 flex gap-8">
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
            className="w-full p-4 text-3xl font-bold font-rem border-b-2 border-gray-200 
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
                className="h-10 px-6 rounded-lg bg-wasis-pr60 text-white font-semibold text-sm
                           flex items-center justify-center disabled:opacity-50"
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
