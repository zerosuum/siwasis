// src/app/api/mock/kas/[id]/route.js
import { DATA } from "../store.mjs";

export async function PUT(req, { params }) {
 const id = Number(params.id);
 const body = await req.json();
 const i = DATA.findIndex((x) => x.id === id);
 if (i === -1) return new Response("Not found", { status: 404 });
 DATA[i] = { ...DATA[i], ...body, id };
 return Response.json(DATA[i]);
}

export async function DELETE(_req, { params }) {
 const id = Number(params.id);
 const i = DATA.findIndex((x) => x.id === id);
 if (i === -1) return new Response("Not found", { status: 404 });
 const [deleted] = DATA.splice(i, 1);
 return Response.json(deleted);
}
