"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function TableToolbar({ month, q, limit }) {
 const router = useRouter();
 const searchParams = useSearchParams();

 const onChange = (key, value) => {
 const sp = new URLSearchParams(searchParams.toString());
 if (value) sp.set(key, value);
 else sp.delete(key);
 // reset ke page 1 tiap kali filter berubah
 sp.set("page", "1");
 if (limit) sp.set("limit", String(limit));
 router.push(`?${sp.toString()}`);
 };

 return (
 <div className="mb-3 flex flex-wrap items-center gap-2">
 <select
 className="rounded-md border px-3 py-2 text-sm"
 value={month ?? ""}
 onChange={(e) => onChange("month", e.target.value)}
 >
 <option value="">Semua Bulan</option>
 {Array.from({ length: 12 }).map((_, i) => (
 <option key={i} value={i + 1}>
 {i + 1}
 </option>
 ))}
 </select>

 <input
 className="rounded-md border px-3 py-2 text-sm"
 placeholder="Cari keterangan/tipe…"
 defaultValue={q ?? ""}
 onKeyDown={(e) => {
 if (e.key === "Enter") onChange("q", e.currentTarget.value);
 }}
 />

 <select
 className="rounded-md border px-2 py-2 text-sm"
 value={String(limit ?? 10)}
 onChange={(e) => onChange("limit", e.target.value)}
 >
 {[10, 20, 50].map((n) => (
 <option key={n} value={n}>
 {n}/hal
 </option>
 ))}
 </select>
 <button
 className="rounded-md border px-3 py-2 text-sm"
 onClick={() => {
 const sp = new URLSearchParams(searchParams.toString());
 ["q", "month", "page"].forEach((k) => sp.delete(k));
 sp.set("limit", String(limit ?? 10));
 router.push(`?${sp.toString()}`);
 }}
 >
 Reset
 </button>
 </div>
 );
}
