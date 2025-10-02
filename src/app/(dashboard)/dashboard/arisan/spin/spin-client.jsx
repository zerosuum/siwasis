"use client";

import { useRouter } from "next/navigation";
import SpinningWheel from "@/components/SpinningWheel";

/**
 * Membungkus SpinningWheel:
 * - menerima segments dari server (serializable)
 * - saat selesai spin: tandai pemenang via API, lalu refresh
 */
export default function SpinningClient({ segments }) {
 const router = useRouter();

 return (
 <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
 <h1 className="text-xl font-semibold">Undian Arisan</h1>
 <p className="text-sm text-neutral-600">
 Tekan Putar untuk mengundi pemenang. Setelah selesai, status pemenang
 akan ditandai otomatis.
 </p>

 <div className="rounded-2xl border bg-white p-4 shadow-sm">
 <SpinningWheel
 segments={segments}
 onFinish={async (winner) => {
 // Tandai pemenang (sesuaikan endpoint kamu)
 if (!winner?.id) return;
 await fetch(`/api/mock/arisan/${winner.id}`, {
 method: "PUT",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ sudahDapat: true }),
 });
 router.refresh();
 }}
 />
 </div>
 </div>
 );
}
