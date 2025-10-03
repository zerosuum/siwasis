export async function PUT(req) {
 const body = await req.json(); // { rows: [...] }
 // TODO: simpan ke store kamu; sementara echo OK
 return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
