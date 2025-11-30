import DocumentClient from "./DocumentClient";
import { getDocuments } from "@/server/queries/documents";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const defaultData = {
  data: [],
  total: 0,
  current_page: 1,
  per_page: 15,
};

export default async function Page({ searchParams }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("siwasis_token")?.value || null;

  const sp = await searchParams;
  const page = sp?.page ? Number(sp.page) : 1;
  const search = sp?.q ?? "";
  const from = sp?.from ?? null;
  const to = sp?.to ?? null;

  let initial;
  try {
    const resp = await getDocuments(token, {
      page,
      search,
      from,
      to,
      perPage: 15,
      tags: ["documents"],
    });

    initial = {
      data: resp.data || [],
      total: resp.pagination?.total || 0,
      current_page: resp.pagination?.current_page || 1,
      per_page: resp.pagination?.per_page || 15,
    };
  } catch (e) {
    console.error("Gagal getDocuments:", e.message);
    initial = defaultData;
  }
  
  const isLoggedIn = !!token;

  return (
    <div className="pb-10">
      <DocumentClient initial={initial} readOnly={!isLoggedIn} />
    </div>
  );
}
