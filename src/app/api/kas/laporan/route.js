import { NextResponse } from "next/server";

export async function GET(req) {
 const url = new URL(req.url);
 const page = Number(url.searchParams.get("page") ?? 1);
 const perPage = Number(url.searchParams.get("per_page") ?? 10);

 const base = Array.from({ length: 28 }).map((_, i) => ({
 id: i + 1,
 tanggal: `2025-09-${String((i % 30) + 1).padStart(2, "0")}`,
 keterangan: [
 "Iuran rutin",
 "Donasi",
 "Biaya konsumsi",
 "Sewa alat",
 "Perlengkapan acara",
 ][i % 5],
 pemasukan: i % 3 === 0 ? 100000 + (i % 7) * 50000 : 0,
 pengeluaran: i % 3 !== 0 ? 50000 + (i % 5) * 25000 : 0,
 }));
 let saldo = 5000000;
 const withSaldo = base.map((r) => {
 saldo = saldo + r.pemasukan - r.pengeluaran;
 return { ...r, saldo };
 });

 const start = (page - 1) * perPage;
 const data = {
 kpi: { pemasukan: 2750000, pengeluaran: 1650000, saldo },
 rows: withSaldo.slice(start, start + perPage),
 page,
 perPage,
 total: base.length,
 };
 return NextResponse.json(data);
}
