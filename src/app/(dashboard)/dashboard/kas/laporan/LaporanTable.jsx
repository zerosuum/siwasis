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

const rp = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",

    currency: "IDR",

    maximumFractionDigits: 0,
  }).format(Number(n || 0));

function SourceChip({ source }) {
  const meta = {
    manual: { bg: "bg-gray-100", fg: "text-gray-700", label: "Manual" },
    rekap: { bg: "bg-[#EEF0E8]", fg: "text-[#6E8649]", label: "Rekap" },
    arisan: { bg: "bg-[#EAF4FE]", fg: "text-[#1161A5]", label: "Arisan" },
  }[source] || {
    bg: "bg-gray-100",
    fg: "text-gray-700",
    label: source || "Manual",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${meta.bg} ${meta.fg}`}
    >
      {meta.label}
    </span>
  );
}

export default function LaporanTable({ initial, onEdit, onDelete, readOnly }) {
  const rows = initial?.rows || [];
  const hasData = rows.length > 0;

  const colCount = readOnly ? 6 : 7; 

  return (
    <TableRoot className="overflow-auto max-h-[600px]">
      <Table className="w-full table-fixed min-w-[1200px]">
        <TableHead className="bg-[#F4F6EE] sticky top-0 z-10 border-0">
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

            {!readOnly && (
              <TableHeaderCell className="w-[126px] text-center py-3 font-semibold text-gray-600">
                Aksi
              </TableHeaderCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody className="text-sm">
          {hasData ? (
            rows.map((r, idx) => (
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
                    : "—"}{" "}
                </TableCell>
                <TableCell className="py-4 text-left">
                  {r.keterangan || "—"}
                </TableCell>
                <TableCell className="py-4 text-center tabular-nums font-medium text-[#6E8649]">
                  {r.pemasukan ? rp(r.pemasukan) : "—"}{" "}
                </TableCell>
                <TableCell className="py-4 text-center tabular-nums font-medium text-[#B24949]">
                  {r.pengeluaran ? rp(r.pengeluaran) : "—"}{" "}
                </TableCell>
                <TableCell className="py-4 text-center tabular-nums font-semibold">
                  {r.saldo ? rp(r.saldo) : "—"}
                </TableCell>

                {!readOnly && (
                  <TableCell className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit?.(r)}
                        className="inline-flex h-8 w-8 min-h-8 min-w-8 items-center justify-center rounded-[10px] bg-[#6E8649] text-white hover:bg-opacity-90 transition [line-height:0]"
                        title="Edit"
                      >
                        <IconEdit size={14} />
                      </button>

                      <button
                        onClick={() => onDelete?.(r)}
                        className="inline-flex h-8 w-8 min-h-8 min-w-8 items-center justify-center rounded-[10px] bg-[#B24949] text-white hover:bg-opacity-90 transition [line-height:0]"
                        title="Hapus"
                      >
                        <IconDelete size={14} />
                      </button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={colCount}
                className="text-center py-10 text-gray-500"
              >
                Tidak ada data.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableRoot>
  );
}
