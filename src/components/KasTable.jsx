"use client";

import DataTable from "@/components/DataTable";
import { rupiah, shortDate } from "@/lib/format";

export default function KasTable({ rows, onEdit, onDelete }) {
 const columns = [
 {
 accessorKey: "tanggal",
 header: "Tanggal",
 cell: ({ row }) => <span>{shortDate(row.original.tanggal)}</span>,
 },
 {
 accessorKey: "keterangan",
 header: "Keterangan",
 cell: ({ getValue }) => <span>{getValue()}</span>,
 },
 {
 accessorKey: "tipe",
 header: "Tipe",
 cell: ({ getValue }) => {
 const v = getValue();
 return (
 <span
 className={`rounded-md px-2 py-1 text-xs ${
 v === "pemasukan" ? "bg-emerald-100" : "bg-rose-100"
 }`}
 >
 {v}
 </span>
 );
 },
 },
 {
 accessorKey: "nominal",
 header: "Nominal",
 cell: ({ getValue }) => (
 <span className="font-medium">{rupiah(getValue())}</span>
 ),
 },
 {
 id: "actions",
 header: "",
 cell: ({ row }) => (
 <div className="flex gap-2">
 <button
 onClick={() => onEdit?.(row.original)}
 className="rounded-md border px-2 py-1 text-xs"
 >
 Edit
 </button>
 <button
 onClick={() => onDelete?.(row.original)}
 className="rounded-md border px-2 py-1 text-xs"
 >
 Hapus
 </button>
 </div>
 ),
 },
 ];

 return <DataTable columns={columns} data={rows} />;
}
