"use client";

export default function Pagination({ page, perPage, total, onPageChange }) {
 const pages = Math.ceil(total / perPage);
 if (pages <= 1) return null;
 return (
 <div className="flex items-center justify-between text-sm mt-3">
 <button
 className="px-3 py-1 border rounded-lg disabled:opacity-50"
 onClick={() => onPageChange(Math.max(1, page - 1))}
 disabled={page <= 1}
 >
 prev
 </button>
 <div className="flex items-center gap-1">
 {Array.from({ length: pages })
 .slice(0, 7)
 .map((_, i) => {
 const p = i + 1;
 return (
 <button
 key={p}
 className={`px-3 py-1 border rounded-lg ${
 p === page
 ? "bg-[rgb(var(--brand))] text-[rgb(var(--brand-ink))]"
 : ""
 }`}
 onClick={() => onPageChange(p)}
 >
 {p}
 </button>
 );
 })}
 {pages > 7 && <span className="px-2">…</span>}
 </div>
 <button
 className="px-3 py-1 border rounded-lg disabled:opacity-50"
 onClick={() => onPageChange(Math.min(pages, page + 1))}
 disabled={page >= pages}
 >
 next
 </button>
 </div>
 );
}
