"use client";
import { Callout } from "@tremor/react";

export default function Toast({
 open,
 onClose,
 title = "Sukses",
 desc = "Berhasil menyimpan perubahan.",
}) {
 if (!open) return null;
 return (
 <div className="fixed right-4 bottom-4 z-50 max-w-sm">
 <Callout title={title} color="teal">
 <div className="flex items-center justify-between gap-3">
 <span>{desc}</span>
 <button
 onClick={onClose}
 className="px-2 py-1 border rounded-lg text-sm"
 >
 Tutup
 </button>
 </div>
 </Callout>
 </div>
 );
}
