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

export default function RekapTable({ initial, editing, updates, onToggle }) {
  const cols = initial.dates?.length
    ? initial.dates
    : buildDateCols(initial.meta?.from, initial.meta?.to);

  const optimistic = React.useMemo(() => {
    const map = new Map();
    for (const u of updates) map.set(`${u.wargaId}-${u.tanggal}`, u.checked);
    return map;
  }, [updates]);

  return (
    <TableRoot className="mt-0">
      <Table className="border-b-0">
        <TableHead className="bg-[#F4F6EE]">
          <TableRow>
            <TableHeaderCell>No</TableHeaderCell>
            <TableHeaderCell>RT</TableHeaderCell>
            <TableHeaderCell>Nama</TableHeaderCell>
            <TableHeaderCell>Jumlah Setoran</TableHeaderCell>
            <TableHeaderCell>Total Setoran</TableHeaderCell>
            {cols.map((c) => (
              <TableHeaderCell key={c}>
                {c.split("-").reverse().join("/")}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody className="border-b-0 [&>*:last-child]:border-b-0">
          {initial.rows.map((row, i) => (
            <TableRow key={row.id}>
              <TableCell className="text-gray-500">
                {String(i + 1).padStart(2, "0")}
              </TableCell>
              <TableCell>{row.rt}</TableCell>
              <TableCell>{row.nama}</TableCell>
              <TableCell>{row.jumlahSetoran}</TableCell>
              <TableCell>{row.totalSetoranFormatted}</TableCell>

              {cols.map((tgl) => {
                const base = row.kehadiran[tgl] ?? false;
                const value = optimistic.has(`${row.id}-${tgl}`)
                  ? optimistic.get(`${row.id}-${tgl}`)
                  : base;
                return (
                  <TableCell key={tgl}>
                    {editing ? (
                      <Checkbox
                        checked={value ? true : false}
                        onCheckedChange={(v) => onToggle(row.id, tgl, !!v)}
                      />
                    ) : (
                      <Checkbox checked={value ? true : false} disabled />
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
