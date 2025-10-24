"use client";
export default function ViewerModal({ url, onClose }) {
  if (!url) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="h-[80vh] w-[80vw] overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <div className="text-sm font-medium truncate">{url}</div>
          <button
            onClick={onClose}
            className="rounded-md bg-gray-100 px-3 py-1 text-sm"
          >
            Tutup
          </button>
        </div>
        <iframe src={url} className="h-[calc(80vh-40px)] w-full" />
      </div>
    </div>
  );
}
