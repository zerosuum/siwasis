"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
  TableCell,
} from "@/components/Table";
import { Pencil as IconEdit, Trash as IconDelete } from "lucide-react";

// format Rupiah
const rp = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

export default function LaporanTable({ initial, onEdit, onDelete }) {
  return (
    <TableRoot className="overflow-auto max-h-[600px]">
      <Table className="w-full table-fixed min-w-[900px]">
        <TableHead className="bg-[#F4F6EE] sticky top-0 z-10">
          <TableRow className="border-b border-gray-200">
            <TableHeaderCell className="w-[56px] text-center py-3 font-semibold text-gray-600">
              No
            </TableHeaderCell>
            <TableHeaderCell className="w-[180px] text-center py-3 font-semibold text-gray-600">
              Tanggal
            </TableHeaderCell>
            <TableHeaderCell className="w-[320px] text-left py-3 font-semibold text-gray-600">
              Keterangan
            </TableHeaderCell>
            <TableHeaderCell className="w-[160px] text-center py-3 font-semibold text-gray-600">
              Pemasukan
            </TableHeaderCell>
            <TableHeaderCell className="w-[160px] text-center py-3 font-semibold text-gray-600">
              Pengeluaran
            </TableHeaderCell>
            <TableHeaderCell className="w-[160px] text-center py-3 font-semibold text-gray-600">
              Saldo
            </TableHeaderCell>
            <TableHeaderCell className="w-[126px] text-center py-3 font-semibold text-gray-600">
              Aksi
            </TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody className="text-sm">
          {(initial.rows || []).map((r, idx) => (
            <TableRow
              key={r.id || idx}
              className="odd:bg-white even:bg-[#FAFBF7] border-b-0"
            >
              <TableCell className="py-4 text-center text-gray-500">
                {(initial.page - 1) * initial.perPage + idx + 1}
              </TableCell>

              <TableCell className="py-4 text-center tabular-nums">
                {r.tanggal
                  ? new Date(r.tanggal).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "-"}
              </TableCell>

              <TableCell className="py-4 text-left">
                {r.keterangan || "-"}
              </TableCell>

              <TableCell className="py-4 text-center tabular-nums font-medium text-[#6E8649]">
                {r.pemasukan ? rp(r.pemasukan) : "-"}
              </TableCell>

              <TableCell className="py-4 text-center tabular-nums font-medium text-[#B24949]">
                {r.pengeluaran ? rp(r.pengeluaran) : "-"}
              </TableCell>

              <TableCell className="py-4 text-center tabular-nums font-semibold">
                {r.saldo ? rp(r.saldo) : "-"}
              </TableCell>

              <TableCell className="py-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit?.(r)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6E8649] text-white hover:bg-opacity-90"
                    title="Edit"
                  >
                    <IconEdit size={14} />
                  </button>
                  <button
                    onClick={() => onDelete?.(r)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6E8649] text-white hover:bg-opacity-90"
                    title="Hapus"
                  >
                    <IconDelete size={14} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableRoot>
  );
}
