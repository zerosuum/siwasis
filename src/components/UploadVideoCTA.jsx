"use client";

import { useEffect, useState } from "react";

export default function UploadVideoCTA() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  const handleUpload = () => {
    if (!/^https?:\/\//i.test(link)) {
      alert("Masukkan link YouTube yang valid.");
      return;
    }
    window.open(link, "_blank");
    setOpen(false);
    setTitle("");
    setLink("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-3 inline-block text-wasis-nt80/90 text-base font-medium
                   underline underline-offset-[6px] decoration-wasis-nt80/40
                   hover:decoration-wasis-nt80 transition-all"
      >
        Unggah video baru
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm
                     flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-[460px] max-w-[90vw] bg-white rounded-2xl shadow-lg p-6
                       animate-slide-up-and-fade"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h3 className="text-xl font-bold font-rem text-wasis-pr80">
              Bagikan video baru
            </h3>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Judul <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan judul…"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-wasis-pr60"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Link YouTube <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="https://youtube.com/…"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-wasis-pr60"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 h-10 rounded-lg bg-gray-200 text-gray-700 font-semibold text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleUpload}
                disabled={!title || !link}
                className="flex-1 h-10 rounded-lg bg-wasis-pr60 text-white font-semibold text-sm
                           flex items-center justify-center disabled:opacity-50"
              >
                Unggah
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
