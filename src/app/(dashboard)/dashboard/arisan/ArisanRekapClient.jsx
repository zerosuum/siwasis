"use client";
import { Card } from "@/components/tremor/Card";
import {
 Table,
 TableHead,
 TableHeaderCell,
 TableBody,
 TableRow,
 TableCell,
} from "@/components/tremor/Table";
import { Button as TButton } from "@/components/tremor/Button";

export default function ArisanRekapClient({ rows }) {
 return (
 <div className="space-y-6">
 <Card className="bg-white border">
 <div className="flex justify-between items-center mb-4">
 <h3 className="font-semibold text-lg">
 Arisan — Rekapitulasi Pembayaran
 </h3>
 <div className="flex gap-2">
 <TButton variant="secondary">Pilih Periode</TButton>
 <TButton>Unduh</TButton>
 </div>
 </div>

 <Table>
 <TableHead>
 <TableRow>
 <TableHeaderCell>No</TableHeaderCell>
 <TableHeaderCell>Nama</TableHeaderCell>
 <TableHeaderCell>Status</TableHeaderCell>
 </TableRow>
 </TableHead>
 <TableBody>
 {rows.map((r, i) => (
 <TableRow key={r.id}>
 <TableCell>{i + 1}</TableCell>
 <TableCell>{r.nama}</TableCell>
 <TableCell>{r.status ?? "Belum bayar"}</TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </Card>
 </div>
 );
}
