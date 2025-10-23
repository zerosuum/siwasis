import { getRekap } from "../_store";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const perPage = Number(searchParams.get("perPage") || 15);
  const year = searchParams.get("year")
    ? Number(searchParams.get("year"))
    : undefined;
  const q = searchParams.get("q") || undefined;
  const rt = searchParams.get("rt") || undefined;
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  const min = searchParams.get("min")
    ? Number(searchParams.get("min"))
    : undefined;
  const max = searchParams.get("max")
    ? Number(searchParams.get("max"))
    : undefined;

  const data = getRekap({ page, perPage, year, q, rt, from, to, min, max });
  return Response.json(data);
}
