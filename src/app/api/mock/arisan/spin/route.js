import { markWinner } from "../../_store";

export async function POST(req) {
  const body = await req.json();
  const { wargaId, tanggal } = body || {};
  const result = markWinner({ wargaId, tanggal });
  return Response.json(result);
}
