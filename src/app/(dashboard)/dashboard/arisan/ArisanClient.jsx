"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";

/* ----------------------------- Toolbar filter ----------------------------- */
function Toolbar({ q, only, limit }) {
 const { push } = useRouter();

 const onChange = (key, val) => {
 const sp = new URLSearchParams(window.location.search);
 if (val) sp.set(key, val);
 else sp.delete(key);
 sp.set("page", "1");
 sp.set("limit", String(limit ?? 10));
 push(`?${sp.toString()}`);
 };

 return (
 <div className="mb-3 flex flex-wrap items-center gap-2">
 <select
 className="rounded-md border px-3 py-2 text-sm"
 value={only ?? ""}
 onChange={(e) => onChange("only", e.target.value)}
 >
 <option value="">Semua</option>
 <option value="belum">Belum Dapat</option>
 <option value="sudah">Sudah Dapat</option>
 </select>
 <input
 className="rounded-md border px-3 py-2 text-sm"
 placeholder="Cari nama…"
 defaultValue={q ?? ""}
 onKeyDown={(e) => {
 if (e.key === "Enter") onChange("q", e.currentTarget.value);
 }}
 />
 <button
 className="rounded-md border px-3 py-2 text-sm"
 onClick={() => onChange("q", "")}
 >
 Reset
 </button>
 </div>
 );
}

/* --------------------------------- Spinwheel -------------------------------- */
function Spinwheel({ open, onClose, onResult }) {
 const [loading, setLoading] = useState(false);
 const [winner, setWinner] = useState(null);

 const spin = async () => {
 try {
 setLoading(true);
 const res = await fetch("/api/mock/arisan/spin", { method: "POST" });
 if (!res.ok) throw new Error(`HTTP ${res.status}`);

 // DEFENSIF: jangan langsung res.json(); parse dari text
 const txt = await res.text();
 const data = txt ? JSON.parse(txt) : { winner: null };

 setWinner(data?.winner ?? null);
 onResult?.(data?.winner ?? null);
 } catch (e) {
 // tetap tenang di UI
 setWinner(null);
 // console.error("Spin failed:", e);
 } finally {
 setLoading(false);
 }
 };

 if (!open) return null;
 return (
 <Modal open={open} onClose={onClose} title="Undi Arisan">
 <div className="space-y-4">
 <div className="grid h-40 place-items-center rounded-xl border">
 {loading ? (
 <div className="animate-pulse">Memutar…</div>
 ) : winner ? (
 <b>{winner.nama}</b>
 ) : (
 "Siap mengundi"
 )}
 </div>
 <div className="flex justify-end gap-2">
 <button
 onClick={onClose}
 className="rounded-md border px-3 py-2 text-sm"
 >
 Tutup
 </button>
 <button
 onClick={spin}
 className="rounded-md bg-black px-3 py-2 text-sm text-white"
 >
 🎡 Putar
 </button>
 </div>
 </div>
 </Modal>
 );
}

/* --------------------------------- Main UI --------------------------------- */
export default function ArisanClient({
 rows,
 total,
 summary, // { totalPeserta, sudah, belum, putaranKe } <-- dihitung di server page
 page,
 limit,
 q,
 only,
}) {
 const router = useRouter();
 const [openAdd, setOpenAdd] = useState(false);
 const [openSpin, setOpenSpin] = useState(false);

 useEffect(() => {
 if (typeof window === "undefined") return;
 const sp = new URLSearchParams(window.location.search);
 if (sp.get("spin") === "1") setOpenSpin(true);
 }, []);


 // Kolom disesuaikan dengan mock API: { id, no, nama, nominal, status, pembayaran }
 const columns = [
 { accessorKey: "id", header: "ID" },
 { accessorKey: "nama", header: "Nama" },
 {
 id: "status",
 header: "Status",
 cell: ({ row }) => {
 const sudah = row.original.status === "sudah";
 return (
 <span
 className={`rounded-md px-2 py-1 text-xs ${
 sudah ? "bg-emerald-100" : "bg-amber-100"
 }`}
 >
 {sudah ? "Sudah" : "Belum"}
 </span>
 );
 },
 },
 {
 id: "aksi",
 header: "",
 cell: ({ row }) => {
 const sudah = row.original.status === "sudah";
 return (
 <div className="flex gap-2">
 {!sudah && (
 <button
 className="rounded-md border px-2 py-1 text-xs"
 onClick={async () => {
 try {
 const res = await fetch(
 `/api/mock/arisan/${row.original.id}`,
 {
 method: "PUT",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ status: "sudah" }),
 }
 );
 if (!res.ok) throw new Error(`HTTP ${res.status}`);
 router.refresh();
 } catch (e) {
 // console.error(e);
 }
 }}
 >
 Tandai Dapat
 </button>
 )}
 <button
 className="rounded-md border px-2 py-1 text-xs"
 onClick={async () => {
 try {
 const res = await fetch(
 `/api/mock/arisan/${row.original.id}`,
 { method: "DELETE" }
 );
 if (!res.ok) throw new Error(`HTTP ${res.status}`);
 router.refresh();
 } catch (e) {
 // console.error(e);
 }
 }}
 >
 Hapus
 </button>
 </div>
 );
 },
 },
 ];

 return (
 <div className="space-y-4">
 <div className="flex items-end justify-between">
 <div>
 <h2 className="text-xl font-semibold">Arisan</h2>
 <p className="text-sm opacity-70">
 Peserta: <b>{summary.totalPeserta}</b> • Sudah:{" "}
 <b>{summary.sudah}</b> • Belum: <b>{summary.belum}</b>{" "}
 {typeof summary.putaranKe !== "undefined" && (
 <>
 • Putaran ke-<b>{summary.putaranKe}</b>
 </>
 )}
 </p>
 </div>
 <div className="flex gap-2">
 <button
 onClick={() => setOpenSpin(true)}
 className="rounded-md bg-black px-3 py-2 text-sm text-white"
 >
 🎡 Putar
 </button>
 <button
 onClick={() => setOpenAdd(true)}
 className="rounded-md border px-3 py-2 text-sm"
 >
 + Tambah Peserta
 </button>
 </div>
 </div>

 <Toolbar q={q} only={only} limit={limit} />
 <DataTable columns={columns} data={rows} />
 <Pagination page={page} limit={limit} total={total} />

 {/* Modal tambah peserta */}
 <Modal
 open={openAdd}
 onClose={() => setOpenAdd(false)}
 title="Tambah Peserta"
 >
 <form
 className="space-y-3"
 onSubmit={async (e) => {
 e.preventDefault();
 const formEl = e.currentTarget;
 const form = new FormData(formEl);
 const nama = form.get("nama");
 try {
 const res = await fetch("/api/mock/arisan", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ nama }),
 });
 if (!res.ok) throw new Error(`HTTP ${res.status}`);
 formEl.reset();
 setOpenAdd(false);
 router.refresh();
 } catch (err) {
 // console.error(err);
 }
 }}
 >
 <input
 name="nama"
 className="w-full rounded-md border px-3 py-2 text-sm"
 placeholder="Nama peserta"
 required
 />
 <div className="flex justify-end">
 <button className="rounded-md bg-black px-4 py-2 text-sm text-white">
 Simpan
 </button>
 </div>
 </form>
 </Modal>

 {/* Spinwheel */}
 <Spinwheel
 open={openSpin}
 onClose={() => setOpenSpin(false)}
 onResult={() => router.refresh()}
 />
 </div>
 );
}
