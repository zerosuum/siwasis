import { DOCS } from "../../store.mjs";

export async function GET(req, { params }) {
 const id = Number(params.id);
 const doc = DOCS.find((d) => d.id === id);
 if (!doc) return new Response("Not found", { status: 404 });

 const { data, filename, mime } = doc;
 const { searchParams } = new URL(req.url);
 const asDownload = searchParams.get("download");

 const headers = new Headers({
 "Content-Type": mime || "application/octet-stream",
 "Content-Length": String(data.byteLength),
 });
 if (asDownload) {
 headers.set(
 "Content-Disposition",
 `attachment; filename*=UTF-8''${encodeURIComponent(
 filename || `dokumen-${id}`
 )}`
 );
 }

 return new Response(data, { status: 200, headers });
}
