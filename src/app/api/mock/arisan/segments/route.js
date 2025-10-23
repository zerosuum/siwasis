import { getSegments } from "../_store";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year")
    ? Number(searchParams.get("year"))
    : undefined;
  const data = getSegments({ year });
  return Response.json(data);
}
