function makeDates(year) {
  // contoh 6 tanggal bulanan
  return ["02", "04", "06", "08", "10", "12"].map((m) => `${year}-${m}-14`);
}
function rupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get("year") || new Date().getFullYear());
  const page = Number(searchParams.get("page") || 1);
  const perPage = 15;
  const q = (searchParams.get("q") || "").toLowerCase();
  const rt = searchParams.get("rt") || "all";

  const dates = makeDates(year);

  // seed 60 warga
  const rowsAll = Array.from({ length: 60 }).map((_, i) => {
    const id = i + 1;
    const rtx = String((i % 5) + 1).padStart(2, "0");
    const nama =
      [
        "Harris",
        "Mike",
        "Rodriguez",
        "Gracia",
        "Emma",
        "Lucas",
        "Miller",
        "Mark",
        "Ali",
        "Evelyn",
      ][i % 10] +
      " " +
      id;
    const status = i % 7 === 0 ? "Sudah Dapat" : "Belum Dapat";
    const jumlahSetoran = 50000;
    const totalSetoran = dates.reduce((a, _d) => a + jumlahSetoran, 0);
    const kehadiran = Object.fromEntries(
      dates.map((d) => [d, Math.random() > 0.35])
    );
    return {
      id,
      rt: rtx,
      nama,
      status,
      jumlahSetoran,
      totalSetoranFormatted: rupiah(totalSetoran),
      kehadiran,
    };
  });

  let filtered = rowsAll;
  if (rt !== "all") filtered = filtered.filter((r) => r.rt === rt);
  if (q) filtered = filtered.filter((r) => r.nama.toLowerCase().includes(q));

  const total = filtered.length;
  const start = (page - 1) * perPage;
  const pageRows = filtered.slice(start, start + perPage);

  // KPI dummy
  const pemasukan = 50000 * dates.length * filtered.length;
  const pengeluaran = Math.floor(pemasukan * 0.1);
  const saldo = pemasukan - pengeluaran;

  return Response.json({
    ok: true,
    meta: { year, nominalFormatted: rupiah(pemasukan) },
    kpi: {
      pemasukanFormatted: rupiah(pemasukan),
      pengeluaranFormatted: rupiah(pengeluaran),
      saldoFormatted: rupiah(saldo),
      rangeLabel: dates.length
        ? `${dates[0]} s/d ${dates[dates.length - 1]}`
        : "—",
    },
    rows: pageRows,
    dates,
    total,
    page,
    perPage,
  });
}
