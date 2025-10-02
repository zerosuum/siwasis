import { PESERTA } from "../store.mjs";

export async function PUT(req, { params }) {
 const id = Number(params.id);
 const idx = PESERTA.findIndex((p) => p.id === id);
 if (idx === -1) return new Response("Not found", { status: 404 });
 const body = await req.json(); // { status?, nominal?, pembayaran? }
 PESERTA[idx] = { ...PESERTA[idx], ...body, id };
 return Response.json(PESERTA[idx]);
}

export async function DELETE(_req, { params }) {
 const id = Number(params.id);
 const idx = PESERTA.findIndex((p) => p.id === id);
 if (idx === -1) return new Response("Not found", { status: 404 });
 const [deleted] = PESERTA.splice(idx, 1);
 return Response.json(deleted);
}
