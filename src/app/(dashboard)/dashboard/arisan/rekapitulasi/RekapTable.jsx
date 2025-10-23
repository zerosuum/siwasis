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
import { Checkbox } from "@/components/Checkbox";

export default function ArisanRekapTable({
  initial,
  editing,
  updates,
  onToggle,
}) {
  const rows = initial?.rows || [];
  const dates = initial?.dates || [];

  const optimistic = React.useMemo(() => {
    if (!updates?.length) return null;
    const m = new Map();
    for (const u of updates) m.set(`${u.wargaId}-${u.tanggal}`, u.checked);
    return m;
  }, [updates]);

  const hasData = rows.length > 0;

  return (
    <TableRoot className="overflow-auto max-h-[600px]">
      <Table className="w-full min-w-[1100px] table-fixed">
        <TableHead className="bg-[#F4F6EE] sticky top-0 z-10 border-0">
          <TableRow className="border-b border-gray-200">
            <TableHeaderCell className="w-[56px] text-center py-3 font-semibold text-gray-600">
              No
            </TableHeaderCell>
            <TableHeaderCell className="w-[56px] text-center py-3 font-semibold text-gray-600">
              RT
            </TableHeaderCell>
            <TableHeaderCell className="w-[200px] text-left py-3 font-semibold text-gray-600">
              Nama
            </TableHeaderCell>
            <TableHeaderCell className="w-[120px] text-center py-3 font-semibold text-gray-600">
              Status
            </TableHeaderCell>
            <TableHeaderCell className="w-[110px] text-center py-3 font-semibold text-gray-600">
              Jumlah Setoran
            </TableHeaderCell>
            <TableHeaderCell className="w-[140px] text-right py-3 font-semibold text-gray-600">
              Total Setoran
            </TableHeaderCell>
            {dates.map((d) => (
              <TableHeaderCell
                key={d}
                className="w-[90px] text-center py-3 font-semibold text-gray-600"
              >
                {d.split("-").reverse().join("/")}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody className="text-sm">
          {hasData ? (
            rows.map((row, i) => (
              <TableRow
                key={row.id}
                className="odd:bg-white even:bg-[#FAFBF7] border-b-0"
              >
                <TableCell className="text-center text-gray-500 py-4">
                  {(initial.page - 1) * initial.perPage + i + 1}
                </TableCell>
                <TableCell className="text-center py-4">{row.rt}</TableCell>
                <TableCell className="text-left py-4">{row.nama}</TableCell>
                <TableCell className="text-center py-4">
                  <span
                    className={
                      row.status === "Sudah Dapat"
                        ? "rounded-full bg-[#EEF0E8] text-[#2B3A1D] px-2 py-1 text-xs"
                        : "rounded-full bg-[#FFF6E5] text-[#B0892E] px-2 py-1 text-xs"
                    }
                  >
                    {row.status}
                  </span>
                </TableCell>
                <TableCell className="text-right py-4 tabular-nums">
                  {row.jumlahSetoran}
                </TableCell>
                <TableCell className="text-right font-medium py-4 tabular-nums">
                  {row.totalSetoranFormatted}
                </TableCell>

                {dates.map((ds) => {
                  const key = `${row.id}-${ds}`;
                  const isChecked = optimistic?.has(key)
                    ? optimistic.get(key)
                    : !!row.kehadiran[ds];
                  return (
                    <TableCell key={key} className="text-center py-4">
                      {editing ? (
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(v) => onToggle?.(row.id, ds, !!v)}
                        />
                      ) : (
                        <span
                          className={
                            isChecked
                              ? "text-green-700 font-semibold"
                              : "text-gray-300"
                          }
                        >
                          {isChecked ? "✓" : "—"}
                        </span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6 + dates.length}
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
