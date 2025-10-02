"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Fungsi untuk membuat array halaman dengan elipsis (...)
function generatePages(currentPage, totalPages) {
  // Jika total halaman sedikit, tampilkan semua
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  // Jika di awal
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }
  // Jika di akhir
  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  // Jika di tengah
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

export default function Pagination({ page, limit, total }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(total / limit);
  const pages = useMemo(
    () => generatePages(page, totalPages),
    [page, totalPages]
  );

  const go = (p) => {
    // Jangan lakukan navigasi jika halaman tidak valid
    if (p < 1 || p > totalPages || p === page) return;

    const sp = new URLSearchParams(searchParams.toString());
    sp.set("page", String(p));
    router.push(`?${sp.toString()}`);
  };

  // Jangan tampilkan apa-apa jika hanya ada 1 halaman atau kurang
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 text-sm font-medium">
      <button
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-gray-600 disabled:pointer-events-none disabled:opacity-50"
      >
        previous
      </button>

      <div className="flex items-center gap-2">
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => go(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-md border ${
                page === p
                  ? "border-[#6E8649] bg-[#6E8649] text-white" // Style aktif
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50" // Style normal
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-gray-600 disabled:pointer-events-none disabled:opacity-50"
      >
        next
      </button>
    </nav>
  );
}
