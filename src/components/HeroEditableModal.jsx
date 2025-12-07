"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/useToast";
import ImageDropzone from "@/components/ImageDropzone";
import { API_PROXY_BASE } from "@/lib/config";

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function HeroEditable({
  isAdmin = false,
  currentImage = "/hero-background.jpg",
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const { show: toast } = useToast();

  if (!isAdmin) return null;

  const handleSave = async () => {
    if (!file) {
      toast({
        variant: "error",
        title: "Belum ada gambar",
        description: "Silakan pilih gambar terlebih dahulu.",
      });
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      toast({
        variant: "error",
        title: "Ukuran file terlalu besar",
        description: `Maksimal ukuran foto sampul adalah ${MAX_SIZE_MB} MB.`,
      });
      return;
    }

    const form = new FormData();
    form.append("image", file);

    try {
      setSaving(true);

      const res = await fetch(`${API_PROXY_BASE}/hero-image`, {
        method: "POST",
        body: form,
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        //
      }

      if (!res.ok) {
        let msg = "Gagal memperbarui foto sampul.";

        if (data?.message) {
          msg = data.message;
        } else if (data?.errors) {
          const firstError = Object.values(data.errors)[0];
          if (Array.isArray(firstError) && firstError[0]) {
            msg = firstError[0];
          } else if (typeof firstError === "string") {
            msg = firstError;
          }
        }

        throw new Error(msg);
      }

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
      console.error(err);
      toast({
        variant: "error",
        title: "Gagal!",
        description:
          err?.message ||
          "Terjadi kesalahan saat memperbarui foto sampul. Coba lagi beberapa saat.",
      });
    } finally {
      setSaving(false);
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
                if (!f) return;

                if (f.size > MAX_SIZE_BYTES) {
                  toast({
                    variant: "error",
                    title: "Ukuran file terlalu besar",
                    description: `Maksimal ukuran foto sampul adalah ${MAX_SIZE_MB} MB.`,
                  });
                  return;
                }

                setFile(f);
                setPreview(url);
              }}
              accept="image/png, image/jpeg"
              labelIdle="Drag & drop gambar ke sini atau klik untuk memilih"
              aspect="16/9"
            />

            <p className="mt-3 text-xs text-gray-500">
              Format yang didukung: JPG, PNG. Maksimal ukuran file {MAX_SIZE_MB}{" "}
              MB.
            </p>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setOpen(false)}
                disabled={saving}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 disabled:opacity-60"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={!file || saving}
                className="rounded-lg bg-wasis-pr60 px-4 py-2 text-wasis-nt80 disabled:opacity-50 flex items-center gap-2"
              >
                {saving && (
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                )}
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
