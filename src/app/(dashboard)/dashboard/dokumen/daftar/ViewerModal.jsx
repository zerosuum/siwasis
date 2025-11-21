"use client";

export default function ViewerModal({ url, onClose }) {
  if (!url) return null;

  const iframeSrc = url.includes("#")
    ? url
    : `${url}#toolbar=0&navpanes=0&scrollbar=0`;

  const filename = url.split("/").pop()?.split("?")[0] || "Pratinjau Dokumen";

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/40">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
        aria-label="Tutup pratinjau"
      />

      <div className="relative z-[260] h-[85vh] w-[95vw] max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <div className="max-w-[70%] truncate text-sm font-medium">
            {filename}
          </div>
          <button
            onClick={onClose}
            className="rounded-md bg-gray-100 px-3 py-1 text-sm"
          >
            Tutup
          </button>
        </div>

        <iframe
          src={iframeSrc}
          className="h-[calc(85vh-40px)] w-full"
          title={filename}
        />
      </div>
    </div>
  );
}