import { NextResponse } from "next/server";

export async function GET(req) {
 const { searchParams } = new URL(req.url);
 const year = Number(searchParams.get("year") || new Date().getFullYear());

 const dates = [
 `${year}-09-01`,
 `${year}-09-15`,
 `${year}-09-29`,
 `${year}-10-13`,
 `${year}-10-27`,
 ];

 const rows = [
 {
 id: "w1",
 rt: "01",
 nama: "Evelyn",
 jumlahSetoran: 1,
 totalSetoranFormatted: "Rp. 10.000",
 kehadiran: { [dates[0]]: true, [dates[1]]: false, [dates[2]]: true },
 },
 {
 id: "w2",
 rt: "02",
 nama: "Mia",
 jumlahSetoran: 2,
 totalSetoranFormatted: "Rp. 20.000",
 kehadiran: { [dates[0]]: true, [dates[1]]: true, [dates[2]]: false },
 },
 ];

 return NextResponse.json({
 meta: {
 from: dates[0],
 to: dates.at(-1),
 nominalFormatted: "Rp. 10.000",
 },
 dates,
 kpi: {
 pemasukanFormatted: "Rp. 2.750.000",
 pengeluaranFormatted: "Rp. 1.650.000",
 saldoFormatted: "Rp. 8.050.000",
 rangeLabel: "15 Agustus 2025 - 15 September 2025",
 },
 rows,
 });
}

export async function POST(req) {
 const payload = await req.json();
 console.log("kas/rekap updates:", payload);
 // Di dunia nyata: validasi + simpan ke DB, lalu return status
 return NextResponse.json({ ok: true });
}
