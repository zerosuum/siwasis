import { NextResponse } from 'next/server';

export async function GET(req) {
 const url = new URL(req.url);
 const page = Number(url.searchParams.get('page') ?? 1);
 const perPage = Number(url.searchParams.get('per_page') ?? 10);

 const periode = ["2025-09-01","2025-09-15","2025-09-29","2025-10-13","2025-10-27"];
 const rows = Array.from({ length: 36 }).map((_, i) => ({
 id: i+1,
 rt: String(((i % 12)+1)).padStart(2,"0"),
 nama: ["Evelyn","Mia","Harri","Odi","Mila","Amelia","Rodriguez","Marin","Garcia","Emma","Benji","Lucas","Sarah","Miller"][i%14],
 jumlah_setoran: (i%6)+1,
 total: ((i%5)+1)*10000,
 tanggal: Object.fromEntries(periode.map((t,idx)=>[t,(i+idx)%2===0]))
 }));
 const start = (page - 1) * perPage;
 const data = {
 kpi: { pemasukan: 2750000, pengeluaran: 1650000, saldo: 8050000 },
 periode,
 rows: rows.slice(start, start + perPage),
 page, perPage, total: rows.length,
 };
 return NextResponse.json(data);
}
