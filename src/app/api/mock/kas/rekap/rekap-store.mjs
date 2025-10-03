// src/app/api/mock/kas/rekap/rekap-store.mjs
function buildDates(year = 2025) {
  const dates = [];
  const d = new Date(`${year}-01-01T00:00:00Z`);
  while (d.getUTCFullYear() === year) {
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    dates.push(`${year}-${mm}-${dd}`);
    d.setUTCDate(d.getUTCDate() + 14); // biweekly
  }
  return dates;
}

function seed() {
  const YEAR = 2025;
  const DATES = buildDates(YEAR);

  const RT_LIST = ["01", "02", "03", "04", "05"];
  const ROWS_COUNT = 120; // jaga tetap ringan

  const ROWS = Array.from({ length: ROWS_COUNT }).map((_, i) => {
    const rt = RT_LIST[i % RT_LIST.length];
    const nama = `Warga ${String(i + 1).padStart(3, "0")}`;
    const jumlahSetoran = 10000;
    const kehadiran = {};
    for (const t of DATES) {
      // pola hadir sederhana & stabil (hindari randomness agar cache efektif)
      const on = (i + DATES.indexOf(t)) % 3 !== 0;
      kehadiran[t] = on;
    }
    const total =
      Object.values(kehadiran).filter(Boolean).length * jumlahSetoran;
    return {
      id: i + 1,
      rt,
      nama,
      jumlahSetoran,
      totalSetoran: total,
      totalSetoranFormatted: total.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }),
      kehadiran,
    };
  });

  const META_BASE = {
    from: `${YEAR}-01-01`,
    to: DATES[DATES.length - 1],
    nominalFormatted: "Rp 10.000", // per setoran default
  };

  return { ROWS, DATES, META_BASE };
}

// Pastikan hanya 1 instance walau HMR
const STORE =
  globalThis.__SIWASIS_REKAP_STORE__ ??
  (globalThis.__SIWASIS_REKAP_STORE__ = seed());

export const ROWS = STORE.ROWS;
export const DATES = STORE.DATES;
export const META_BASE = STORE.META_BASE;

// Bekukan agar tidak berubah-ubah & mempermudah GC
Object.freeze(ROWS);
Object.freeze(DATES);
Object.freeze(META_BASE);
