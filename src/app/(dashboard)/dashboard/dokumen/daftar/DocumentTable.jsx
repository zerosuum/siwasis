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

function ActionIcon({ title, onClick, variant = "default", children }) {
  const theme =
    variant === "danger"
      ? "bg-[#B24949] focus:ring-[#F0C5C5]"
      : "bg-[#6E8649] focus:ring-[#C9D6B4]";
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`inline-flex aspect-square h-8 items-center justify-center rounded-full text-white shadow-sm
      transition active:scale-95 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme}`}
    >
      {children}
    </button>
  );
}

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
  const itemsPerPage = Number(initial?.per_page) || 15;

  const fmtDate = (s) =>
    s
      ? new Date(s).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "—";

  return (
    <TableRoot className="overflow-auto max-h-[700px]">
      <Table className="w-full table-fixed min-w-[1000px]">
        <TableHead className="bg-[#F4F6EE] sticky top-0 z-10 border-0">
          <TableRow className="border-b border-gray-200">
            <TableHeaderCell className="w-[56px] text-center py-3 font-semibold text-gray-600">
              No
            </TableHeaderCell>
            <TableHeaderCell className="w-[320px] text-left py-3 font-semibold text-gray-600">
              Nama Dokumen
            </TableHeaderCell>
            <TableHeaderCell className="w-[180px] text-center py-3 font-semibold text-gray-600">
              Tanggal Upload
            </TableHeaderCell>
            <TableHeaderCell className="text-left py-3 font-semibold text-gray-600">
              Keterangan
            </TableHeaderCell>
            <TableHeaderCell className="w-[160px] text-center py-3 font-semibold text-gray-600">
              Aksi
            </TableHeaderCell>
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
                  {(currentPage - 1) * itemsPerPage + idx + 1}
                </TableCell>
                <TableCell className="py-4 text-left font-medium">
                  {r.title || r.filename}
                </TableCell>
                <TableCell className="py-4 text-center tabular-nums">
                  {fmtDate(r.uploaded_at)}
                </TableCell>
                <TableCell className="py-4 text-left">
                  {r.description || "—"}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center justify-center gap-1.5">
                    <ActionIcon title="Lihat" onClick={() => onView?.(r)}>
                      <IconEye size={16} strokeWidth={2} className="shrink-0" />
                    </ActionIcon>
                    {!readOnly && (
                      <>
                        <ActionIcon title="Edit" onClick={() => onEdit?.(r)}>
                          <IconEdit
                            size={16}
                            strokeWidth={2}
                            className="shrink-0"
                          />
                        </ActionIcon>
                        <ActionIcon
                          title="Hapus"
                          variant="danger"
                          onClick={() => onDelete?.(r)}
                        >
                          <IconDelete
                            size={16}
                            strokeWidth={2}
                            className="shrink-0"
                          />
                        </ActionIcon>
                      </>
                    )}
                    <ActionIcon
                      title="Download"
                      onClick={() => onDownload?.(r)}
                    >
                      <IconDownload
                        size={16}
                        strokeWidth={2}
                        className="shrink-0"
                      />
                    </ActionIcon>
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
