// src/app/(dashboard)/dashboard/dokumen/daftar/page.js
import KPICard from "@/components/KPICard";
import DocumentClient from "./DocumentClient";
import { getDocuments } from "@/server/queries/documents";

export const dynamic = "force-dynamic";

const defaultData = { rows: [], total: 0, page: 1, perPage: 15, kpi: null };

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  const page = sp?.page ? Number(sp.page) : 1;
  const search = sp?.q ?? "";
  const from = sp?.from ?? null;
  const to = sp?.to ?? null;

  let initial;
  try {
    initial = (await getDocuments({ page, search, from, to })) || defaultData;
  } catch {
    initial = defaultData;
  }

  // const kpis = [
  //   {
  //     label: "Total Dokumen",
  //     value: Intl.NumberFormat("id-ID").format(initial.total),
  //     range: "—",
  //   },
  //   {
  //     label: "Ditampilkan",
  //     value: Intl.NumberFormat("id-ID").format(initial.rows.length),
  //     range: `Hal. ${initial.page}`,
  //   },
  //   { label: "Per Halaman", value: initial.perPage, range: "—" },
  // ];

  return (
    <div className="pb-10">
      {/* <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {kpis.map((k) => (
          <KPICard key={k.label} {...k} />
        ))}
      </div> */}

      <DocumentClient initial={initial} />
    </div>
  );
}
