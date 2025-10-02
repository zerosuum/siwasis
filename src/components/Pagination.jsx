"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { usePagination } from "@/hooks/usePagintaion";

export default function Pagination({ page, limit, total }) {
 const router = useRouter();
 const searchParams = useSearchParams();

 const state = useMemo(
 () => usePagination({ page, limit, total }),
 [page, limit, total]
 );

 const go = (p) => {
 const sp = new URLSearchParams(searchParams.toString());
 sp.set("page", String(p));
 sp.set("limit", String(limit));
 router.push(`?${sp.toString()}`);
 };

 return (
 <div className="mt-3 flex items-center justify-between gap-2">
 <div className="text-sm opacity-70">
 Halaman {state.page} dari {state.totalPages} • {total} data
 </div>
 <div className="flex items-center gap-1">
 <button
 className="rounded-md border px-2 py-1 text-sm"
 onClick={() => go(state.first)}
 disabled={!state.hasPrev}
 >
 ⏮︎
 </button>
 <button
 className="rounded-md border px-2 py-1 text-sm"
 onClick={() => go(state.prev)}
 disabled={!state.hasPrev}
 >
 ‹
 </button>
 {state.pages.map((p) => (
 <button
 key={p}
 className={`rounded-md border px-2 py-1 text-sm ${
 p === state.page ? "bg-black text-white" : ""
 }`}
 onClick={() => go(p)}
 >
 {p}
 </button>
 ))}
 <button
 className="rounded-md border px-2 py-1 text-sm"
 onClick={() => go(state.next)}
 disabled={!state.hasNext}
 >
 ›
 </button>
 <button
 className="rounded-md border px-2 py-1 text-sm"
 onClick={() => go(state.last)}
 disabled={!state.hasNext}
 >
 ⏭︎
 </button>
 </div>
 </div>
 );
}
