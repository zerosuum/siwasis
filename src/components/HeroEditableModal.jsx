"use client";

import { useRef, useState } from "react";
import { useToast } from "@/components/ui/useToast";
import ImageDropzone from "@/components/ImageDropzone";

export default function HeroEditable({
  isAdmin = false,
  currentImage = "/hero-background.jpg",
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const { show: toast } = useToast();

  if (!isAdmin) return null;

  const handleSave = async () => {
    if (!file) return;
    const form = new FormData();
    form.append("image", file);

    try {
      const res = await fetch("/api/hero", { method: "POST", body: form });
      if (!res.ok) throw new Error("Gagal memperbarui foto sampul.");

      toast({
        variant: "success",
        title: "Sukses!",
        description: "Foto sampul berhasil diperbarui.",
      });

      setOpen(false);
      const url = new URL(window.location.href);
      url.searchParams.set("hero_updated", Date.now().toString());
      window.location.href = url.toString();
    } catch (err) {
      toast({
        variant: "error",
        title: "Gagal!",
        description: err.message || "Gagal memperbarui foto sampul.",
      });
    }
  };

  return (
    <>
      <div
        className="absolute inset-0 z-20 group cursor-pointer"
        onClick={() => setOpen(true)}
        aria-label="Ubah sampul"
      >
        <div className="absolute top-6 right-6 rounded-lg bg-black/40 text-white text-sm px-3 py-1 opacity-0 group-hover:opacity-100 transition">
          Ubah sampul
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[420px] max-w-[90vw] rounded-2xl bg-white p-6 shadow-modal">
            <h3 className="text-wasis-pr80 font-rem font-bold text-[18px] mb-4">
              Ubah Foto Sampul
            </h3>

            <ImageDropzone
              initialUrl={preview || currentImage}
              onChange={(f, url) => {
                setFile(f);
                setPreview(url);
              }}
              labelIdle="Drag & drop gambar ke sini atau klik untuk memilih"
              aspect="16/9"
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={!file}
                className="rounded-lg bg-wasis-pr60 px-4 py-2 text-wasis-nt80 disabled:opacity-50"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
