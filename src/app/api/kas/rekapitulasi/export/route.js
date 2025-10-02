// app/api/kas/rekapitulasi/export/route.js
import { NextResponse } from "next/server";
import { getKasRekap } from "@/server/queries/kas";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get("year")) || new Date().getFullYear();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const q = searchParams.get("q") || "";
  const rt = searchParams.get("rt") || "";

  const data = (await getKasRekap({ year, from, to, search: q, rt })) || {
    rows: [],
    dates: [],
    kpi: {},
    meta: {},
  };

  // CSV header
  const cols = data.dates?.length ? data.dates : [];
  const head = [
    "No",
    "RT",
    "Nama",
    "Jumlah Setoran",
    "Total Setoran",
    ...cols.map((c) => c.split("-").reverse().join("/")),
  ];

  const lines = [head.join(",")];
  data.rows.forEach((row, i) => {
    const cells = [
      String(i + 1).padStart(2, "0"),
      row.rt ?? "",
      `"${(row.nama ?? "").replaceAll('"', '""')}"`,
      row.jumlahSetoran ?? 0,
      `"${(row.totalSetoranFormatted ?? "").replaceAll('"', '""')}"`,
      ...cols.map((c) => (row.kehadiran?.[c] ? "1" : "0")),
    ];
    lines.push(cells.join(","));
  });

  const body = lines.join("\n");
  const filename = `rekap_kas_${year}${from ? "_" + from : ""}${
    to ? "_" + to : ""
  }.csv`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
