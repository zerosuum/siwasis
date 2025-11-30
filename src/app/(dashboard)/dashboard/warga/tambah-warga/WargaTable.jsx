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
import { Pencil as IconEdit, Trash as IconDelete } from "lucide-react";

const rp = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

const ROLE_LABELS = {
  warga: "Warga",
  ketua: "Ketua",
  wakil_ketua: "Wakil Ketua",
  sekretaris: "Sekretaris",
  bendahara: "Bendahara",
};

function getRoleLabel(role) {
  if (!role) return "Warga";
  const key = String(role).toLowerCase();
  return ROLE_LABELS[key] || role;
}

function ArisanBadge({ status }) {
  if (!status) return null;

  const s = String(status).toLowerCase();
  if (s === "tidak_ikut") return null;

  const statusNormalized = s.includes("sudah");
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

export default function WargaTable({ initial, onEdit, onDelete }) {
  const rows = initial?.data ?? initial?.rows ?? [];
  const hasData = rows.length > 0;

  const colCount = 8;

  const currentPage = Number(initial?.page || initial?.current_page) || 1;
  const itemsPerPage = Number(initial?.perPage || initial?.per_page) || 15;

  return (
    <TableRoot
      className="overflow-auto"
      style={{ maxHeight: "calc(100vh - 72px - 24px - 56px - 72px)" }}
    >
      <Table className="w-full table-fixed min-w-[960px] border-b-0">
        <TableHead className="bg-[#F4F6EE] sticky top-0 z-10">
          <TableRow>
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
              Total Kas
            </TableHeaderCell>
            <TableHeaderCell className="w-[160px] text-center py-3 font-semibold text-gray-600">
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
                  {(currentPage - 1) * itemsPerPage + idx + 1}
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

                <TableCell className="py-4">{getRoleLabel(r.role)}</TableCell>

                <TableCell className="py-4">
                  {r.status_arisan && r.status_arisan !== "tidak_ikut" ? (
                    <ArisanBadge status={r.status_arisan} />
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </TableCell>

                <TableCell className="py-4 text-center tabular-nums font-medium">
                  {r.setoran_kas ? rp(r.setoran_kas) : "—"}
                </TableCell>

                <TableCell className="py-4 text-center tabular-nums font-medium">
                  {r.setoran_arisan ? rp(r.setoran_arisan) : "—"}
                </TableCell>

                <TableCell className="py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit?.(r)}
                      className="inline-flex h-8 w-8 min-h-8 min-w-8 items-center justify-center rounded-[10px] bg-[#6E8649] text-white hover:bg-opacity-90 transition [line-height:0]"
                      title="Edit"
                      aria-label="Edit"
                    >
                      <IconEdit size={14} strokeWidth={1.75} />
                    </button>

                    <button
                      onClick={() => onDelete?.(r)}
                      className="inline-flex h-8 w-8 min-h-8 min-w-8 items-center justify-center rounded-[10px] bg-[#6E8649] text-white hover:bg-opacity-90 transition [line-height:0]"
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
