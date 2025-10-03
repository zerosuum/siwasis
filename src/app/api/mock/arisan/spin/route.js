import { PESERTA } from "../store.mjs";

export async function POST() {
 try {
 const pool = PESERTA.filter((p) => p.status !== "sudah");
 if (pool.length === 0) {
 // tetap JSON, jangan kosong
 return Response.json({
 winner: null,
 message: "Semua peserta sudah dapat.",
 });
 }
 const winner = pool[Math.floor(Math.random() * pool.length)];
 // update status
 const i = PESERTA.findIndex((p) => p.id === winner.id);
 if (i !== -1) PESERTA[i] = { ...PESERTA[i], status: "sudah" };

 return Response.json({ winner });
 } catch (e) {
 // tetap JSON saat error
 return Response.json(
 { winner: null, error: e?.message ?? "unknown" },
 { status: 500 }
 );
 }
}
