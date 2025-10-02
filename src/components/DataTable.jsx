"use client";

import {
 useReactTable,
 getCoreRowModel,
 flexRender,
} from "@tanstack/react-table";

export default function DataTable({ columns, data }) {
 const table = useReactTable({
 data,
 columns,
 getCoreRowModel: getCoreRowModel(),
 });

 return (
 <div className="overflow-x-auto rounded-xl border bg-white">
 <table className="min-w-full text-sm">
 <thead className="border-b bg-neutral-50">
 {table.getHeaderGroups().map((hg) => (
 <tr key={hg.id}>
 {hg.headers.map((h) => (
 <th key={h.id} className="px-3 py-2 text-left font-medium">
 {h.isPlaceholder
 ? null
 : flexRender(h.column.columnDef.header, h.getContext())}
 </th>
 ))}
 </tr>
 ))}
 </thead>
 <tbody>
 {table.getRowModel().rows.length === 0 ? (
 <tr>
 <td
 className="px-3 py-4 text-center opacity-70"
 colSpan={columns.length}
 >
 Tidak ada data
 </td>
 </tr>
 ) : (
 table.getRowModel().rows.map((row) => (
 <tr key={row.id} className="border-b last:border-0">
 {row.getVisibleCells().map((cell) => (
 <td key={cell.id} className="px-3 py-2">
 {flexRender(cell.column.columnDef.cell, cell.getContext())}
 </td>
 ))}
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 );
}
