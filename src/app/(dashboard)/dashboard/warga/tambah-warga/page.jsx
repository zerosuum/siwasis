import { getWarga } from "@/server/queries/warga";
import WargaClient from "./WargaClient";

export default async function Page({ searchParams }) {
  const sp = (await searchParams) ?? {};

  const {
    page = "1",
    q = "",
    rt = "all",
    role = "",
    dob_from = "",
    dob_to = "",
    kas_only,
    arisan_only,
    limit = "15",
    kas_min,
    kas_max,
    arisan_min,
    arisan_max,
  } = sp;

  const toNum = (v) =>
    v !== undefined && v !== null && String(v).trim() !== ""
      ? Number(v)
      : undefined;

  const initial = await getWarga({
    page: Number(page) || 1,
    q,
    rt,
    role,
    dob_from,
    dob_to,
    kas_only: kas_only === "1" || kas_only === "true",
    arisan_only: arisan_only === "1" || arisan_only === "true",
    perPage: Number(limit) || 15,
    kas_min: toNum(kas_min),
    kas_max: toNum(kas_max),
    arisan_min: toNum(arisan_min),
    arisan_max: toNum(arisan_max),
  });

  return <WargaClient initial={initial} />;
}
