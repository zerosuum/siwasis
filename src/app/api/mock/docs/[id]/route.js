import { DOCS } from "../store.mjs";

export async function DELETE(_req, { params }) {
 const id = Number(params.id);
 const i = DOCS.findIndex((d) => d.id === id);
 if (i === -1) return new Response("Not found", { status: 404 });
 const [deleted] = DOCS.splice(i, 1);
 const meta = { ...deleted };
 delete meta.data;
 return Response.json(meta);
}
