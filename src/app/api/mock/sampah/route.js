import { DATA } from "./store.mjs";

function getMonthFromDate(iso) {
 return Number(iso.slice(5, 7));
}
function filterByMonth(rows, monthNum) {
 if (!monthNum) return rows;
 return rows.filter((r) => getMonthFromDate(r.tanggal) === Number(monthNum));
}

export async function GET(req) {
 const { searchParams } = new URL(req.url);
 const page = Number(searchParams.get("page") ?? 1);
 const limit = Number(searchParams.get("limit") ?? 10);
 const month = searchParams.get("month");
 const q = (searchParams.get("q") ?? "").toLowerCase();

 const filtered = filterByMonth(DATA, month).filter((r) =>
 q ? r.keterangan.toLowerCase().includes(q) || r.tipe.includes(q) : true
 );

 const total = filtered.length;
 const start = (page - 1) * limit;
 const end = start + limit;
 const rows = filtered.slice(start, end);

 const pemasukan = filtered
 .filter((r) => r.tipe === "pemasukan")
 .reduce((a, b) => a + b.nominal, 0);
 const pengeluaran = filtered
 .filter((r) => r.tipe === "pengeluaran")
 .reduce((a, b) => a + b.nominal, 0);

 return Response.json({
 page,
 limit,
 total,
 month: month ? Number(month) : null,
 summary: { pemasukan, pengeluaran, saldo: pemasukan - pengeluaran },
 rows,
 });
}

export async function POST(req) {
 const body = await req.json();
 const id = DATA.length ? Math.max(...DATA.map((x) => x.id)) + 1 : 1;
 const newItem = {
 id,
 tanggal: body.tanggal,
 keterangan: body.keterangan,
 tipe: body.tipe, // "pemasukan" | "pengeluaran"
 nominal: Number(body.nominal),
 };
 DATA.unshift(newItem);
 return Response.json(newItem, { status: 201 });
}
