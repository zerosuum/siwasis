import { ROWS, DATES, META_BASE } from "./rekap-store.mjs";

const PER_PAGE = 15;

function withinRange(dateISO, from, to) {
  if (from && dateISO < from) return false;
  if (to && dateISO > to) return false;
  return true;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const q = (searchParams.get("q") || "").toLowerCase();
  const rt = searchParams.get("rt") || "";

  // Filter data di server
  let filteredRows = ROWS;
  if (rt && rt !== "all") {
    filteredRows = filteredRows.filter((r) => String(r.rt) === String(rt));
  }
  if (q) {
    filteredRows = filteredRows.filter((r) => r.nama.toLowerCase().includes(q));
  }

  const total = filteredRows.length;
  const paginatedRows = filteredRows.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  // Kalkulasi KPI bisa disederhanakan atau di-mock untuk performa dev
  const kpi = {
    pemasukanFormatted: "Rp 12.345.000", // Contoh KPI
    pengeluaranFormatted: "Rp 0",
    saldoFormatted: "Rp 12.345.000",
    rangeLabel: `Periode ${
      searchParams.get("year") || new Date().getFullYear()
    }`,
  };

  return Response.json({
    meta: META_BASE,
    kpi: kpi,
    rows: paginatedRows, // Hanya kirim data per halaman
    dates: DATES,
    total: total,
    page: page,
    perPage: PER_PAGE,
  });
}
