// src/app/api/mock/kas/rekap/rekap-store.mjs

function buildDates(year = 2025) {
  const dates = [];
  // Mulai dari 1 Januari tahun yang ditentukan, dalam UTC
  const d = new Date(Date.UTC(year, 0, 1));
  while (d.getUTCFullYear() === year) {
    // Format tanggal menjadi YYYY-MM-DD
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    dates.push(`${year}-${mm}-${dd}`);
    // Pindah ke 14 hari berikutnya
    d.setUTCDate(d.getUTCDate() + 14);
  }
  return dates;
}

function seed() {
  const YEAR = 2025;
  const DATES = buildDates(YEAR);

  const RT_LIST = ["01", "02", "03", "04", "05"];
  const ROWS_COUNT = 120; // Jumlah total data warga dummy

  const ROWS = Array.from({ length: ROWS_COUNT }).map((_, i) => {
    const rt = RT_LIST[i % RT_LIST.length];
    const nama = `Warga ${String(i + 1).padStart(3, "0")}`;
    const jumlahSetoran = 10000;
    const kehadiran = {};
    for (const t of DATES) {
      // Pola sederhana untuk menentukan kehadiran agar datanya konsisten
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
    nominalFormatted: "Rp 10.000",
  };

  return { ROWS, DATES, META_BASE };
}

// Gunakan cache global agar data tidak dibuat ulang setiap kali ada hot-reload
const STORE =
  globalThis.__SIWASIS_REKAP_STORE__ ??
  (globalThis.__SIWASIS_REKAP_STORE__ = seed());

export const ROWS = STORE.ROWS;
export const DATES = STORE.DATES;
export const META_BASE = STORE.META_BASE;

// Bekukan objek agar tidak bisa diubah secara tidak sengaja
Object.freeze(ROWS);
Object.freeze(DATES);
Object.freeze(META_BASE);
