import { cookies } from "next/headers";
import { getWarga } from "@/server/queries/warga";
import WargaClient from "./WargaClient";
import { getPeriodes } from "@/server/queries/periode";

export const dynamic = "force-dynamic";

function normalizeWarga(resp) {
  const pag = resp.pagination || {};
  return {
    ...resp,
    data: resp.data ?? resp.rows ?? [],
    page: resp.page ?? pag.current_page ?? 1,
    perPage: resp.perPage ?? pag.per_page ?? 10,
    total: resp.total ?? pag.total ?? 0,
  };
}

export default async function Page({ searchParams }) {
  const sp = (await searchParams) ?? {};

  const cookieStore = await cookies();
  const token = cookieStore.get("siwasis_token")?.value || null;

  const {
    page = "1",
    q = "",
    rt = "all",
    role = "",
    dob_from = "",
    dob_to = "",
    kas_only,
    arisan_only,
    limit = "10",
    kas_min,
    kas_max,
    arisan_min,
    arisan_max,
    arisan_status,
    periode,
  } = sp;

  const toNum = (v) =>
    v !== undefined && v !== null && String(v).trim() !== ""
      ? Number(v)
      : undefined;

  const raw = await getWarga(token, {
    page: Number(page) || 1,
    q,
    rt,
    role,
    dob_from,
    dob_to,
    kas_only: kas_only === "1" || kas_only === "true",
    arisan_only: arisan_only === "1" || arisan_only === "true",
    perPage: Number(limit) || 10,
    kas_min: toNum(kas_min),
    kas_max: toNum(kas_max),
    arisan_min: toNum(arisan_min),
    arisan_max: toNum(arisan_max),
    arisan_status,
    periode_id: periode ? Number(periode) : undefined
  });

  const initial = normalizeWarga(raw);

  let periodes = [];

  try {
    const periodeResp = await getPeriodes().catch(() => null);
    periodes = Array.isArray(periodeResp?.data) ? periodeResp.data : [];
  } catch {
    periodes = [];
  }

  return <WargaClient initial={initial} periodes={periodes} />;
}
