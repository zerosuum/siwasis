"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Title,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  DateRangePicker,
  Button,
} from "@tremor/react";
import { getKasLaporan } from "@/server/queries/kas";

const rp = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

export default function Page() {
  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);

  useEffect(() => {
    getKasLaporan({ page }).then(setData);
  }, [page]);

  if (!data) return <div className="p-4">Loading…</div>;
  const totalPages = Math.ceil(data.total / data.perPage);

  return (
    <div className="space-y-4">
      {/* KPI */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 md:p-5">
          <div className="text-sm opacity-70">Pemasukan</div>
          <div className="text-2xl font-semibold">{rp(data.kpi.pemasukan)}</div>
        </Card>
        <Card className="p-4 md:p-5">
          <div className="text-sm opacity-70">Pengeluaran</div>
          <div className="text-2xl font-semibold">
            {rp(data.kpi.pengeluaran)}
          </div>
        </Card>
        <Card className="p-4 md:p-5">
          <div className="text-sm opacity-70">Saldo</div>
          <div className="text-2xl font-semibold">{rp(data.kpi.saldo)}</div>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Title>Laporan Keuangan</Title>
        <div className="flex items-center gap-2">
          <div className="w-[260px]">
            <DateRangePicker value={range} onValueChange={setRange} />
          </div>
          <Button color="gray">Export CSV</Button>
        </div>
      </div>

      <Card className="overflow-x-auto">
        <Table className="min-w-[860px]">
          <TableHead>
            <TableRow>
              <TableHeaderCell>No</TableHeaderCell>
              <TableHeaderCell>Tanggal</TableHeaderCell>
              <TableHeaderCell>Keterangan</TableHeaderCell>
              <TableHeaderCell align="right">Pemasukan</TableHeaderCell>
              <TableHeaderCell align="right">Pengeluaran</TableHeaderCell>
              <TableHeaderCell align="right">Saldo</TableHeaderCell>
              <TableHeaderCell align="center">Aksi</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.rows.map((r, idx) => (
              <TableRow key={r.id}>
                <TableCell>
                  {(data.page - 1) * data.perPage + idx + 1}
                </TableCell>
                <TableCell>
                  {new Date(r.tanggal).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell>{r.keterangan}</TableCell>
                <TableCell align="right">
                  {r.pemasukan ? rp(r.pemasukan) : "-"}
                </TableCell>
                <TableCell align="right">
                  {r.pengeluaran ? rp(r.pengeluaran) : "-"}
                </TableCell>
                <TableCell align="right">{rp(r.saldo)}</TableCell>
                <TableCell align="center">
                  <div className="flex items-center justify-center gap-2">
                    <Button size="xs" variant="light">
                      Edit
                    </Button>
                    <Button size="xs" color="rose" variant="light">
                      Hapus
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm mt-3">
          <button
            className="px-3 py-1 border rounded-lg disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={data.page <= 1}
          >
            prev
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages })
              .slice(0, 7)
              .map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    className={`px-3 py-1 border rounded-lg ${
                      p === data.page ? "bg-green-700 text-white" : ""
                    }`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                );
              })}
            {totalPages > 7 && <span className="px-2">…</span>}
          </div>
          <button
            className="px-3 py-1 border rounded-lg disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={data.page >= totalPages}
          >
            next
          </button>
        </div>
      </Card>
    </div>
  );
}
