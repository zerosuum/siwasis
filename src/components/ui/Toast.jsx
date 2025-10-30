"use client";
import * as React from "react";

const variants = {
  success: {
    wrap: "bg-[#f7fbf2] border-[#ccdfb0]/80",
    title: "text-[#2d3b17]",
    desc: "text-[#46552d]",
    ring: "bg-[#e8f3d8] border-[#bcd298]",
    check: "stroke-[#6e8649]",
  },
  error: {
    wrap: "bg-[#fff6f6] border-[#f2b8b5]/80",
    title: "text-[#3b1a1a]",
    desc: "text-[#5c2a2a]",
    ring: "bg-[#ffe2e0] border-[#f2b8b5]",
    check: "stroke-[#d64545]",
  },
  info: {
    wrap: "bg-[#f5f8ff] border-[#cbdafc]/80",
    title: "text-[#1e2a4a]",
    desc: "text-[#31456e]",
    ring: "bg-[#e6edff] border-[#cbdafc]",
    check: "stroke-[#3b6ef5]",
  },
};

export default function Toast({
  open,
  onClose,
  title = "Sukses!",
  desc = "Berhasil menyimpan perubahan.",
  variant = "success",
  duration = 2400,
}) {
  const v = variants[variant] ?? variants.success;

  React.useEffect(() => {
    if (!open) return;
    if (duration <= 0) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center">
      {/* backdrop tipis biar fokus, tapi ga nge-block klik */}
      <div className="pointer-events-none absolute inset-0 bg-black/10" />
      <div
        role="status"
        aria-live="polite"
        className={`relative mx-4 max-w-[560px] w-[92vw] rounded-2xl border shadow-2xl ${v.wrap} animate-in fade-in zoom-in-95`}
      >
        <div className="flex gap-4 p-6">
          {/* icon */}
          <div
            className={`h-16 w-16 shrink-0 rounded-full border ${v.ring} grid place-items-center`}
          >
            {/* checklist / cross */}
            {variant === "error" ? (
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                className={v.check}
              >
                <path
                  d="M7 7l10 10M17 7L7 17"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                className={v.check}
              >
                <path
                  d="M20 6L9 17l-5-5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>

          <div className="min-w-0">
            <div className={`text-xl font-semibold ${v.title}`}>{title}</div>
            {desc ? (
              <div className={`mt-1 text-base leading-6 ${v.desc}`}>{desc}</div>
            ) : null}
          </div>

          <button
            onClick={onClose}
            className="ml-auto mt-1 rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-black/5"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
