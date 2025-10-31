"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
  TableCell,
} from "@/components/Table";
import {
  Pencil as IconEdit,
  Trash as IconDelete,
  Plus as IconPlus,
} from "lucide-react";

const rp = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

function ArisanBadge({ status }) {
  if (!status) return null;

  const statusNormalized = status.toLowerCase().includes("sudah");

  const statusText = statusNormalized ? "Sudah Dapat" : "Belum Dapat";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
        statusNormalized
          ? "bg-[#EEF0E8] text-[#2B3A1D]" 
          : "bg-[#FFF6E5] text-[#B0892E]"
      }`}
    >
      {statusText}
    </span>
  );
}

export default function WargaTable({
  initial,
  onEdit,
  onDelete,
  onAddArisan,
}) {
  const rows = initial?.data ?? initial?.rows ?? [];
  const hasData = rows.length > 0;
  const colCount = 10;

  return (
    <TableRoot
      className="overflow-auto"
      style={{ maxHeight: "calc(100vh - 72px - 24px - 56px - 72px)" }}
    >
      <Table className="w-full table-fixed min-w-[1200px]">
        <TableHead className="bg-[#F4F6EE] sticky top-0 z-10 border-0">
          <TableRow className="border-b border-gray-200">
            <TableHeaderCell className="w-[56px] text-center py-3 font-semibold text-gray-600">
              No
            </TableHeaderCell>
            <TableHeaderCell className="w-[80px] text-center py-3 font-semibold text-gray-600">
              RT
            </TableHeaderCell>
            <TableHeaderCell className="w-[260px] text-left py-3 font-semibold text-gray-600">
              Nama
            </TableHeaderCell>
            <TableHeaderCell className="w-[140px] text-left py-3 font-semibold text-gray-600">
              Role
            </TableHeaderCell>
            <TableHeaderCell className="w-[150px] text-left py-3 font-semibold text-gray-600">
              Status Arisan
            </TableHeaderCell>
            <TableHeaderCell className="w-[150px] text-center py-3 font-semibold text-gray-600">
              Jumlah Setoran Kas
            </TableHeaderCell>
            <TableHeaderCell className="w-[150px] text-center py-3 font-semibold text-gray-600">
              Total Kas
            </TableHeaderCell>
            <TableHeaderCell className="w-[160px] text-center py-3 font-semibold text-gray-600">
              Jumlah Setoran Arisan
            </TableHeaderCell>
            <TableHeaderCell className="w-[150px] text-center py-3 font-semibold text-gray-600">
              Total Arisan
            </TableHeaderCell>
            <TableHeaderCell className="w-[126px] text-center py-3 font-semibold text-gray-600">
              Aksi
            </TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody className="text-sm">
          {hasData ? (
            rows.map((r, idx) => (
              <TableRow
                key={r.id ?? idx}
                className="odd:bg-white even:bg-[#FAFBF7] border-b-0"
              >
                <TableCell className="py-4 text-center text-gray-500">
                  {(initial.page - 1) * initial.perPage + idx + 1}
                </TableCell>

                <TableCell className="py-4 text-center tabular-nums">
                  {r.rt ?? r.rt_code ?? "—"}
                </TableCell>

                <TableCell className="py-4">
                  <div className="font-medium">{r.nama}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {r.alamat || "—"}
                  </div>
                </TableCell>

                <TableCell className="py-4 capitalize">
                  {r.role || "Warga"}
                </TableCell>

                <TableCell className="py-4">
                  {r.arisan_status ? (
                    <ArisanBadge status={r.arisan_status} />
                  ) : (
                    <button
                      className="inline-flex items-center gap-1 text-xs text-[#6E8649] underline"
                      onClick={() => onAddArisan?.(r)}
                      title="Tandai sebagai anggota arisan"
                    >
                      <IconPlus size={12} />
                      Tandai anggota
                    </button>
                  )}
                </TableCell>

                <TableCell className="py-4 text-center tabular-nums">
                  {r.kas_setoran_count ?? 0}
                </TableCell>
                <TableCell className="py-4 text-center tabular-nums font-medium">
                  {r.kas_total ? rp(r.kas_total) : "—"}
                </TableCell>

                <TableCell className="py-4 text-center tabular-nums">
                  {r.arisan_setoran_count ?? 0}
                </TableCell>
                <TableCell className="py-4 text-center tabular-nums font-medium">
                  {r.arisan_total ? rp(r.arisan_total) : "—"}
                </TableCell>

                <TableCell className="py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit?.(r)}
                      className="inline-flex h-8 w-8 min-h-8 min-w-8 items-center justify-center rounded-full bg-[#6E8649] text-white hover:bg-opacity-90 transition [line-height:0]"
                      title="Edit"
                      aria-label="Edit"
                    >
                      <IconEdit size={14} strokeWidth={1.75} />
                    </button>

                    <button
                      onClick={() => onDelete?.(r)}
                      className="inline-flex h-8 w-8 min-h-8 min-w-8 items-center justify-center rounded-full bg-[#6E8649] text-white hover:bg-opacity-90 transition [line-height:0]"
                      title="Hapus"
                      aria-label="Hapus"
                    >
                      <IconDelete size={14} strokeWidth={1.75} />
                    </button>
                  </div>
                </TableCell>
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
