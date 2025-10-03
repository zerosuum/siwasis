import { PESERTA } from "./store.mjs";

export async function GET(req) {
 const { searchParams } = new URL(req.url);
 const page = Number(searchParams.get("page") ?? 1);
 const limit = Number(searchParams.get("limit") ?? 10);
 const q = (searchParams.get("q") ?? "").toLowerCase();

 const filtered = PESERTA.filter((p) =>
 q ? p.nama.toLowerCase().includes(q) : true
 );

 const total = filtered.length;
 const start = (page - 1) * limit;
 const rows = filtered.slice(start, start + limit);

 // SELALU JSON
 return Response.json({ page, limit, total, rows });
}
