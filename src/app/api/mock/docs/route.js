import { DOCS, nextId } from "./store.mjs";

export async function GET(req) {
 const { searchParams } = new URL(req.url);
 const q = (searchParams.get("search") ?? "").toLowerCase();

 const rows = DOCS.filter((d) =>
 q
 ? d.title.toLowerCase().includes(q) ||
 (d.description ?? "").toLowerCase().includes(q) ||
 (d.filename ?? "").toLowerCase().includes(q)
 : true
 )
 .map(({ data, ...meta }) => meta) // jangan kirim data binari di list
 .sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));

 return Response.json({ rows });
}

export async function POST(req) {
 // Expect: multipart/form-data: file, title, description
 const form = await req.formData();
 const file = form.get("file");
 const title = (form.get("title") ?? "").toString();
 const description = (form.get("description") ?? "").toString();

 if (!file || typeof file === "string") {
 return new Response("File is required", { status: 400 });
 }

 const id = nextId();
 const arrayBuf = await file.arrayBuffer();
 const data = new Uint8Array(arrayBuf);

 const doc = {
 id,
 title: title || file.name || `Dokumen #${id}`,
 description,
 filename: file.name,
 mime: file.type || "application/octet-stream",
 size: file.size ?? data.byteLength,
 uploadedAt: new Date().toISOString(),
 data, // simpan binari untuk route download
 };

 DOCS.unshift(doc);

 // Kembalikan metadata + URL unduh
 const meta = { ...doc };
 delete meta.data;
 meta.file_url = `/api/mock/docs/${id}/file`;
 return Response.json(meta, { status: 201 });
}
