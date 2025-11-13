"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function generatePages(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }
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

export default function Pagination({ page = 1, limit = 15, total = 0 }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(page) || 1;
  const perPage = Number(limit) || 15;
  const totalItems = Number(total) || 0;

  const totalPages = Math.ceil(totalItems / perPage);
  const pages = useMemo(
    () => generatePages(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const go = (p) => {
    if (p < 1 || p > totalPages || p === currentPage) return;

    const sp = new URLSearchParams(searchParams.toString());
    sp.set("page", String(p));
    router.push(`?${sp.toString()}`);
  };

  // if (totalPages <= 1) {
  //   return null;
  // }

  return (
    <nav className="flex items-center gap-2 text-sm font-medium">
      <button
        onClick={() => go(currentPage - 1)}
        disabled={currentPage <= 1}
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
                currentPage === p
                  ? "border-[#6E8649] bg-[#6E8649] text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p} { }
            </button>
          )
        )}
      </div>

      <button
        onClick={() => go(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-gray-600 disabled:pointer-events-none disabled:opacity-50"
      >
        next
      </button>
    </nav>
  );
}
