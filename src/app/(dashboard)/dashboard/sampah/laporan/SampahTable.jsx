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

export default function SampahTable({ initial, onEdit, onDelete, readOnly }) {
  const paginatedData = initial?.data || {};
  const rows = paginatedData?.data || [];
  const hasData = rows.length > 0;
  const colCount = readOnly ? 6 : 7;

  const currentPage = Number(paginatedData?.current_page) || 1;
  const itemsPerPage =
    Number(paginatedData?.per_page) || (hasData ? rows.length : 15);

  const formatTanggal = (tgl) =>
    tgl
      ? new Date(tgl).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "—";

  return (
    <>
      <TableRoot className="hidden max-h-[600px] w-full overflow-auto md:block">
        <Table className="w-full table-fixed min-w-[1200px]">
          <TableHead className="sticky top-0 z-10 border-0 bg-[#F4F6EE]">
            <TableRow className="border-b border-gray-200">
              <TableHeaderCell className="w-[56px] py-3 text-center font-semibold text-gray-600">
                No
              </TableHeaderCell>
              <TableHeaderCell className="w-[180px] py-3 text-center font-semibold text-gray-600">
                Tanggal
              </TableHeaderCell>
              <TableHeaderCell className="w-[320px] py-3 text-left font-semibold text-gray-600">
                Keterangan
              </TableHeaderCell>
              <TableHeaderCell className="w-[160px] py-3 text-center font-semibold text-gray-600">
                Pemasukan
              </TableHeaderCell>
              <TableHeaderCell className="w-[160px] py-3 text-center font-semibold text-gray-600">
                Pengeluaran
              </TableHeaderCell>
              <TableHeaderCell className="w-[160px] py-3 text-center font-semibold text-gray-600">
                Saldo
              </TableHeaderCell>
              {!readOnly && (
                <TableHeaderCell className="w-[126px] py-3 text-center font-semibold text-gray-600">
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
                  className="border-b-0 odd:bg-white even:bg-[#FAFBF7]"
                >
                  <TableCell className="py-4 text-center text-gray-500">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </TableCell>

                  <TableCell className="py-4 text-center tabular-nums">
                    {formatTanggal(r.tanggal)}
                  </TableCell>

                  <TableCell className="py-4 text-left">
                    {r.keterangan || "—"}
                  </TableCell>

                  <TableCell className="py-4 text-center font-medium tabular-nums text-[#6E8649]">
                    {r.tipe === "pemasukan" ? rp(r.jumlah) : "—"}
                  </TableCell>

                  <TableCell className="py-4 text-center font-medium tabular-nums text-[#B24949]">
                    {r.tipe === "pengeluaran" ? rp(r.jumlah) : "—"}
                  </TableCell>

                  <TableCell className="py-4 text-center tabular-nums font-semibold">
                    {typeof r.saldo_sementara === "number"
                      ? rp(r.saldo_sementara)
                      : "—"}
                  </TableCell>

                  {!readOnly && (
                    <TableCell className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit?.(r)}
                          className="inline-flex h-8 w-8 min-h-8 min-w-8 items-center justify-center rounded-[10px] bg-[#6E8649] text-white hover:bg-opacity-90 transition [line-height:0]"
                          title="Edit"
                        >
                          <IconEdit size={14} />
                        </button>
                        <button
                          type="button"
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
                  className="py-10 text-center text-gray-500"
                >
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableRoot>

      <div className="mt-3 space-y-3 md:hidden">
        {hasData ? (
          rows.map((r, idx) => {
            const nomor = (currentPage - 1) * itemsPerPage + idx + 1;
            const isIn = r.tipe === "pemasukan";
            const nominalLabel = isIn ? "Pemasukan" : "Pengeluaran";
            const nominalColor = isIn ? "text-[#6E8649]" : "text-[#B24949]";
            const saldoLabel =
              typeof r.saldo_sementara === "number"
                ? rp(r.saldo_sementara)
                : "—";

            return (
              <div
                key={r.id || idx}
                className="rounded-xl border border-[#E2E7D7] bg-white px-3 py-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-gray-400">
                      No. {nomor}
                    </span>
                    <p className="text-sm font-medium text-gray-800">
                      {r.keterangan || "—"}
                    </p>
                    <span className="text-[12px] text-gray-500">
                      {formatTanggal(r.tanggal)}
                    </span>
                  </div>

                  {!readOnly && (
                    <div className="flex flex-col items-end gap-2">
                      <div className="inline-flex gap-1">
                        <button
                          type="button"
                          onClick={() => onEdit?.(r)}
                          className="inline-flex h-8 w-8 min-h-8 min-w-8 items-center justify-center rounded-[10px] bg-[#6E8649] text-white hover:bg-opacity-90 transition [line-height:0]"
                          title="Edit"
                        >
                          <IconEdit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete?.(r)}
                          className="inline-flex h-8 w-8 min-h-8 min-w-8 items-center justify-center rounded-[10px] bg-[#B24949] text-white hover:bg-opacity-90 transition [line-height:0]"
                          title="Hapus"
                        >
                          <IconDelete size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-gray-500">
                      {nominalLabel}
                    </span>
                    <span
                      className={`text-[13px] font-semibold tabular-nums ${nominalColor}`}
                    >
                      {rp(r.jumlah)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5 text-right">
                    <span className="text-[11px] text-gray-500">Saldo</span>
                    <span className="text-[13px] font-semibold tabular-nums">
                      {saldoLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="py-6 text-center text-sm text-gray-500">
            Tidak ada data.
          </p>
        )}
      </div>
    </>
  );
}
