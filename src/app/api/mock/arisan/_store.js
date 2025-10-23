let YEAR = new Date().getFullYear();

function idr(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

let warga = [
  { id: 1, nama: "Harris", rt: "01", sudahDapat: false },
  { id: 2, nama: "Mike", rt: "01", sudahDapat: false },
  { id: 3, nama: "Rodriguez", rt: "02", sudahDapat: false },
  { id: 4, nama: "Gracia", rt: "03", sudahDapat: false },
  { id: 5, nama: "Emma", rt: "03", sudahDapat: false },
  { id: 6, nama: "Lucas", rt: "04", sudahDapat: false },
  { id: 7, nama: "Miller", rt: "04", sudahDapat: false },
  { id: 8, nama: "Mark", rt: "05", sudahDapat: false },
  { id: 9, nama: "Ali", rt: "05", sudahDapat: false },
  { id: 10, nama: "Evelyn", rt: "05", sudahDapat: false },
];

function monthDates(year = YEAR) {
  const arr = [];
  for (let m = 1; m <= 12; m++) {
    const mm = String(m).padStart(2, "0");
    arr.push(`${year}-${mm}-05`);
  }
  return arr;
}
let DATES = monthDates(YEAR);


let hadir = new Map(); // key: `${wargaId}-${date}`, value: boolean

for (const w of warga) for (const d of DATES) hadir.set(`${w.id}-${d}`, false);

// hitung total setoran per warga (misal 50k per hadir)
const NOMINAL = 50000;

export function getSegments({ year }) {
  if (year && year !== YEAR) resetYear(year);
  return warga
    .filter((w) => !w.sudahDapat)
    .map((w, i) => ({
      id: w.id,
      label: w.nama,
      color: palette[i % palette.length],
    }));
}

const palette = [
  "#3D7E3D",
  "#7E63D9",
  "#6C46C6",
  "#7EC1E4",
  "#9AC5F7",
  "#3B6DE8",
  "#E9C65B",
  "#E59E45",
  "#D25A4D",
  "#83C29D",
];

export function markWinner({ wargaId, tanggal }) {
  const w = warga.find((x) => x.id === Number(wargaId));
  if (!w) return { ok: false };
  w.sudahDapat = true;
  hadir.set(`${w.id}-${tanggal}`, true);
  return { ok: true };
}

export function getKPI({ from, to }) {
  let count = 0;
  for (const [key, val] of hadir.entries()) {
    if (!val) continue;
    const [, date] = key.split("-");
  }
  const pemasukan = 0;
  return {
    pemasukanFormatted: idr(pemasukan),
    pengeluaranFormatted: idr(0),
    saldoFormatted: idr(pemasukan),
    rangeLabel: from && to ? `${from} s/d ${to}` : "Periode aktif",
  };
}

export function getRekap({
  page = 1,
  perPage = 15,
  year,
  q,
  rt,
  from,
  to,
  min,
  max,
}) {
  if (year && year !== YEAR) resetYear(year);

  let rows = warga.slice();
  if (q)
    rows = rows.filter((w) => w.nama.toLowerCase().includes(q.toLowerCase()));
  if (rt && rt !== "all") rows = rows.filter((w) => w.rt === rt);

  const dates = DATES.slice();

  const mapped = rows.map((w) => {
    let jumlahSetoran = 0;
    const kehadiran = {};
    for (const d of dates) {
      const checked = !!hadir.get(`${w.id}-${d}`);
      kehadiran[d] = checked;
      if (checked) jumlahSetoran += NOMINAL;
    }
    return {
      id: w.id,
      rt: w.rt,
      nama: w.nama,
      status: w.sudahDapat ? "Sudah Dapat" : "Belum Dapat",
      jumlahSetoran: idr(NOMINAL), 
      totalSetoranFormatted: idr(jumlahSetoran),
      kehadiran,
    };
  });

  const total = mapped.length;
  const start = (page - 1) * perPage;
  const end = start + perPage;

  return {
    meta: { year: YEAR, nominalFormatted: idr(NOMINAL) },
    kpi: getKPI({ from, to }),
    rows: mapped.slice(start, end),
    dates,
    total,
    page,
    perPage,
  };
}

function resetYear(y) {
  YEAR = Number(y);
  DATES = monthDates(YEAR);
  hadir = new Map();
  for (const w of warga)
    for (const d of DATES) hadir.set(`${w.id}-${d}`, false);
}
