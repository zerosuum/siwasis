import { API_BASE, setParams } from "@/server/queries/_api";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = 1; 
  const year = searchParams.get("year") || new Date().getFullYear();
  const q = searchParams.get("q") || "";
  const rt = searchParams.get("rt") || "all";
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  const min = searchParams.get("min") || undefined;
  const max = searchParams.get("max") || undefined;

  const url = new URL(`${API_BASE}/arisan/rekap`);
  setParams(url, { page, year, q, rt, from, to, min, max });

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    return new Response(`Gagal mengambil data: ${txt}`, { status: 500 });
  }
  const data = await res.json();

  const dates = Array.isArray(data.dates) ? data.dates : [];
  const header = [
    "No",
    "Nama",
    "RT",
    "Status",
    "Jumlah Setoran",
    "Total Setoran",
    ...dates.map((d) => d.split("-").reverse().join("/")),
  ];

  let csv = header.join(",") + "\n";
  (data.rows || []).forEach((row, i) => {
    const base = [
      i + 1,
      `"${row.nama?.replace(/"/g, '""') || ""}"`,
      row.rt || "",
      row.status || "",
      row.jumlahSetoran || "0x",
      row.totalSetoranFormatted || "Rp 0",
    ];
    const marks = dates.map((d) => (row.kehadiran?.[d] ? "v" : "x"));
    csv += [...base, ...marks].join(",") + "\n";
  });

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rekap-arisan-${year}.csv"`,
    },
  });
}
