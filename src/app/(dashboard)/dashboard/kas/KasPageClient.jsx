"use client";

import { useState } from "react";
import TableToolbar from "@/components/TableToolbar";
import KasTable from "@/components/KasTable";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";
import KasForm from "@/components/KasForm";
import { rupiah } from "@/lib/format";
import { useRouter } from "next/navigation";

export default function KasPageClient({
 rows,
 total,
 summary,
 month,
 q,
 page,
 limit,
}) {
 const [openCreate, setOpenCreate] = useState(false);
 const [openEdit, setOpenEdit] = useState(false);
 const [openDelete, setOpenDelete] = useState(false);
 const [selected, setSelected] = useState(null);
 const router = useRouter();

 const onEdit = (row) => {
 setSelected(row);
 setOpenEdit(true);
 };
 const onDelete = (row) => {
 setSelected(row);
 setOpenDelete(true);
 };

 const confirmDelete = async () => {
 await fetch(`/api/mock/kas/${selected.id}`, { method: "DELETE" });
 setOpenDelete(false);
 setSelected(null);
 router.refresh();
 };

 return (
 <div className="space-y-4">
 <div className="flex flex-wrap items-end justify-between gap-3">
 <div>
 <h2 className="text-xl font-semibold">Kas</h2>
 <p className="text-sm opacity-70">
 Rekap mingguan, laporan, filter bulan, pagination
 </p>
 </div>
 <div className="flex items-center gap-2">
 <div className="rounded-xl border bg-white px-4 py-2 text-sm">
 <span className="mr-3">
 Pemasukan: <b>{rupiah(summary.pemasukan)}</b>
 </span>
 <span className="mr-3">
 Pengeluaran: <b>{rupiah(summary.pengeluaran)}</b>
 </span>
 <span>
 Saldo: <b>{rupiah(summary.saldo)}</b>
 </span>
 </div>
 <button
 onClick={() => setOpenCreate(true)}
 className="rounded-md bg-black px-3 py-2 text-white text-sm"
 >
 + Tambah
 </button>
 </div>
 </div>

 <TableToolbar month={month} q={q} limit={limit} />
 <KasTable rows={rows} onEdit={onEdit} onDelete={onDelete} />
 <Pagination page={page} limit={limit} total={total} />

 <Modal
 open={openCreate}
 onClose={() => setOpenCreate(false)}
 title="Tambah Transaksi Kas"
 >
 <KasForm mode="create" onSuccess={() => setOpenCreate(false)} />
 </Modal>

 <Modal
 open={openEdit}
 onClose={() => setOpenEdit(false)}
 title="Edit Transaksi Kas"
 >
 {selected && (
 <KasForm
 mode="edit"
 id={selected.id}
 defaults={selected}
 onSuccess={() => {
 setOpenEdit(false);
 setSelected(null);
 }}
 />
 )}
 </Modal>

 <Modal
 open={openDelete}
 onClose={() => setOpenDelete(false)}
 title="Hapus Transaksi?"
 >
 {selected && (
 <div className="space-y-4">
 <p className="text-sm">
 Yakin menghapus <b>{selected.keterangan}</b> ({selected.tipe},{" "}
 {rupiah(selected.nominal)})?
 </p>
 <div className="flex justify-end gap-2">
 <button
 onClick={() => setOpenDelete(false)}
 className="rounded-md border px-3 py-2 text-sm"
 >
 Batal
 </button>
 <button
 onClick={confirmDelete}
 className="rounded-md bg-black px-3 py-2 text-white text-sm"
 >
 Hapus
 </button>
 </div>
 </div>
 )}
 </Modal>
 </div>
 );
}
