"use client";

export default function UploadVideoTrigger({
  eventName = "OPEN_UPLOAD_VIDEO",
}) {
  return (
    <button
      type="button"
      onClick={() => document.dispatchEvent(new CustomEvent(eventName))}
      className="inline-block text-base font-medium text-wasis-nt80/90
                 underline underline-offset-[6px] decoration-wasis-nt80/40
                 hover:decoration-wasis-nt80 transition-all"
    >
      Unggah video baru
    </button>
  );
}
