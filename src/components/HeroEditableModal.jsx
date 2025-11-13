"use client";

import { useRef, useState } from "react";
import { useToast } from "@/components/ui/useToast"; 

export default function HeroEditable({
  isAdmin = false,
  currentImage = "/hero-background.jpg",
}) {
  const [open, setOpen] = useState(false);
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const { show: toast } = useToast();

  if (!isAdmin) return null;

  const onPick = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) onPick(f);
  };

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
      window.location.reload();
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

            <div className="mb-4">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                <img
                  src={preview || currentImage}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={handleDrop}
              className={`mb-4 rounded-xl border-2 p-6 text-center transition
                ${
                  drag
                    ? "border-wasis-pr60 bg-wasis-pr00/60"
                    : "border-dashed border-gray-300"
                }`}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              <p className="text-sm text-gray-700">
                {file
                  ? file.name
                  : "Drag & drop gambar ke sini atau klik untuk memilih"}
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPick(e.target.files?.[0])}
              />
            </div>

            <div className="flex justify-end gap-3">
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
