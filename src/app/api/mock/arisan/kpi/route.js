import { getKPI } from "../../_store";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  const data = getKPI({ from, to });
  return Response.json(data);
}
