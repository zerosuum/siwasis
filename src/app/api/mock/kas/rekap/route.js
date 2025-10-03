// src/app/api/mock/kas/rekap/route.js
import { ROWS, DATES, META_BASE } from "./rekap-store.mjs";

function withinRange(dateISO, from, to) {
  if (from && dateISO < from) return false;
  if (to && dateISO > to) return false;
  return true;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const year = Number(searchParams.get("year") || 2025);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const q = (searchParams.get("q") || "").toLowerCase();
  const rt = searchParams.get("rt") || ""; // "all" atau "01" dsb

  // Filter tanggal (pakai array DATES yang sudah ringan & frozen)
  const dates = DATES.filter((d) => withinRange(d, from, to));

  // Filter rows: RT + keyword
  let rows = ROWS;
  if (rt && rt !== "all")
    rows = rows.filter((r) => String(r.rt) === String(rt));
  if (q) rows = rows.filter((r) => r.nama.toLowerCase().includes(q));

  // Hitung KPI cepat (tanpa bikin objek baru besar-besar)
  let pemasukan = 0;
  for (const r of rows) {
    let count = 0;
    for (const d of dates) if (r.kehadiran[d]) count++;
    pemasukan += count * r.jumlahSetoran;
  }
  const pengeluaran = 0; // mock
  const saldo = pemasukan - pengeluaran;

  const kpi = {
    pemasukanFormatted: pemasukan.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }),
    pengeluaranFormatted: pengeluaran.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }),
    saldoFormatted: saldo.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }),
    rangeLabel:
      from && to
        ? `${from.split("-").reverse().join("/")} – ${to
            .split("-")
            .reverse()
            .join("/")}`
        : `Periode ${year}`,
  };

  // Balikkan hanya field yang dipakai UI (hindari payload super besar)
  const rowsSlim = rows.map((r) => ({
    id: r.id,
    rt: r.rt,
    nama: r.nama,
    jumlahSetoran: r.jumlahSetoran,
    totalSetoranFormatted: r.totalSetoranFormatted,
    // jangan kirim semua tanggal raw; RekapTable sudah konsumsi r.kehadiran[tgl]
    kehadiran: dates.reduce((acc, d) => {
      acc[d] = r.kehadiran[d] ? 1 : 0;
      return acc;
    }, {}),
  }));

  const meta = {
    ...META_BASE,
    year,
    from: from || META_BASE.from,
    to: to || META_BASE.to,
    nominalFormatted: META_BASE.nominalFormatted,
  };

  return Response.json({
    meta,
    kpi,
    rows: rowsSlim,
    dates, // dipakai header kolom
  });
}
