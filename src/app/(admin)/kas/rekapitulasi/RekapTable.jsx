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

function buildDateCols(fromISO, toISO) {
  const result = [];
  const from = fromISO ? new Date(fromISO) : null;
  const to = toISO ? new Date(toISO) : null;
  if (!from || !to) return result;
  let d = new Date(from);
  while (d <= to) {
    result.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 14);
  }
  return result;
}

export default function RekapTable({
  initial,
  editing,
  updates,
  onToggle,
  page = 1,
  pageSize = 10,
}) {
  const cols = initial.dates?.length
    ? initial.dates
    : buildDateCols(initial.meta?.from, initial.meta?.to);

  const optimistic = React.useMemo(() => {
    const map = new Map();
    for (const u of updates) map.set(`${u.wargaId}-${u.tanggal}`, u.checked);
    return map;
  }, [updates]);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const rows = initial.rows.slice(start, end);

  return (
    <TableRoot className="overflow-auto max-h-[600px]">
      <Table className="table-fixed min-w-[900px]">
        <TableHead className="bg-[#F4F6EE] sticky top-0 z-10">
          <TableRow className="border-b border-gray-200">
            <TableHeaderCell className="w-[56px] sticky left-0 z-20 bg-[#F4F6EE] py-3 font-semibold text-gray-600 text-center">
              No
            </TableHeaderCell>
            <TableHeaderCell className="w-[56px] sticky left-[56px] z-20 bg-[#F4F6EE] py-3 font-semibold text-gray-600 text-center">
              RT
            </TableHeaderCell>
            <TableHeaderCell className="w-[200px] sticky left-[112px] z-20 bg-[#F4F6EE] py-3 font-semibold text-gray-600">
              Nama
            </TableHeaderCell>
            <TableHeaderCell className="w-[140px] text-center py-3 font-semibold text-gray-600">
              Jumlah Setoran
            </TableHeaderCell>
            <TableHeaderCell className="w-[180px] text-center py-3 font-semibold text-gray-600">
              Total Setoran
            </TableHeaderCell>
            {cols.map((c) => (
              <TableHeaderCell
                key={c}
                className="w-[126px] text-center py-3 font-semibold text-gray-600"
              >
                {c.split("-").reverse().join("/")}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody className="text-sm">
          {rows.map((row, i) => (
            <TableRow
              key={row.id}
              className="odd:bg-white even:bg-[#FAFBF7] border-b-0"
            >
              <TableCell className="sticky left-0 z-10 bg-inherit text-center text-gray-500 py-4">
                {String(start + i + 1).padStart(2, "0")}
              </TableCell>
              <TableCell className="sticky left-[56px] z-10 bg-inherit text-center py-4">
                {row.rt}
              </TableCell>
              <TableCell className="sticky left-[112px] z-10 bg-inherit whitespace-nowrap py-4">
                {row.nama}
              </TableCell>
              <TableCell className="text-center tabular-nums py-4">
                {row.jumlahSetoran}
              </TableCell>
              <TableCell className="text-center tabular-nums font-medium py-4">
                {row.totalSetoranFormatted}
              </TableCell>

              {cols.map((tgl) => {
                const base = row.kehadiran[tgl] ?? false;
                const value = optimistic.has(`${row.id}-${tgl}`)
                  ? optimistic.get(`${row.id}-${tgl}`)
                  : base;
                return (
                  <TableCell key={tgl} className="text-center py-4">
                    {editing ? (
                      <Checkbox
                        checked={!!value}
                        onCheckedChange={(v) => onToggle(row.id, tgl, !!v)}
                        className="mx-auto"
                        aria-label={`Set ${row.nama} ${tgl}`}
                      />
                    ) : (
                      <span
                        className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded ${
                          value ? "text-[#2e7d32]" : "text-gray-400"
                        }`}
                      >
                        {value ? "✔" : "—"}
                      </span>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableRoot>
  );
}
