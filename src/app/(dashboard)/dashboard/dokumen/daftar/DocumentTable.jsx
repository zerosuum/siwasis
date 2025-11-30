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
import {
  Eye as IconEye,
  Pencil as IconEdit,
  Trash as IconDelete,
  Download as IconDownload,
} from "lucide-react";

export default function DocumentTable({
  initial,
  onView,
  onEdit,
  onDelete,
  onDownload,
  readOnly,
}) {
  const rows = initial?.data || [];
  const hasData = rows.length > 0;
  const colCount = 5;

  const currentPage = Number(initial?.current_page) || 1;
  const itemsPerPage =
    Number(initial?.per_page) || (hasData ? rows.length : 15);

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
        <Table className="w-full min-w-[1100px]">
          <TableHead className="sticky top-0 z-10 border-0 bg-[#F4F6EE]">
            <TableRow className="border-b border-gray-200">
              <TableHeaderCell className="w-[56px] py-3 text-center font-semibold text-gray-600">
                No
              </TableHeaderCell>
              <TableHeaderCell className="w-[320px] py-3 text-left font-semibold text-gray-600">
                Nama Dokumen
              </TableHeaderCell>
              <TableHeaderCell className="w-[180px] py-3 text-center font-semibold text-gray-600">
                Tanggal Upload
              </TableHeaderCell>
              <TableHeaderCell className="py-3 text-left font-semibold text-gray-600">
                Keterangan
              </TableHeaderCell>
              <TableHeaderCell className="w-[220px] min-w-[220px] py-3 text-center font-semibold text-gray-600">
                Aksi
              </TableHeaderCell>
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
                  <TableCell className="py-4 text-left font-medium">
                    {r.title || r.filename}
                  </TableCell>
                  <TableCell className="py-4 text-center tabular-nums">
                    {formatTanggal(r.uploaded_at)}
                  </TableCell>
                  <TableCell className="py-4 text-left">
                    {r.description || "—"}
                  </TableCell>
                  <TableCell className="py-4 min-w-[220px]">
                    <div className="flex items-center justify-center gap-2 flex-wrap md:flex-nowrap">
                      <button
                        type="button"
                        onClick={() => onView?.(r)}
                        className="inline-flex h-8 w-8 min-h-8 min-w-8 items-center justify-center rounded-[10px] bg-[#6E8649] text-white hover:bg-opacity-90 transition [line-height:0]"
                        title="Lihat"
                      >
                        <IconEye size={14} />
                      </button>

                      {!readOnly && (
                        <>
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
                          <button
                            type="button"
                            onClick={() => onDownload?.(r)}
                            className="inline-flex h-8 w-8 min-h-8 min-w-8 items-center justify-center rounded-[10px] bg-[#6E8649] text-white hover:bg-opacity-90 transition [line-height:0]"
                            title="Download"
                          >
                            <IconDownload size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </TableCell>
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
                      {r.title || r.filename}
                    </p>
                    <span className="text-[12px] text-gray-500">
                      {formatTanggal(r.uploaded_at)}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="inline-flex gap-1">
                      <button
                        type="button"
                        onClick={() => onView?.(r)}
                        className="inline-flex h-8 w-8 min-h-8 min-w-8 items-center justify-center rounded-[10px] bg-[#6E8649] text-white hover:bg-opacity-90 transition [line-height:0]"
                        title="Lihat"
                      >
                        <IconEye size={14} />
                      </button>

                      {!readOnly && (
                        <>
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
                          <button
                            type="button"
                            onClick={() => onDownload?.(r)}
                            className="inline-flex h-8 w-8 min-h-8 min-w-8 items-center justify-center rounded-[10px] bg-[#6E8649] text-white hover:bg-opacity-90 transition [line-height:0]"
                            title="Download"
                          >
                            <IconDownload size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[13px] text-gray-600">
                  {r.description || "—"}
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
