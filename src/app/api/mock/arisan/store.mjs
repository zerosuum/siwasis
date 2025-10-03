function seed() {
  // 24 peserta default
  return Array.from({ length: 24 }).map((_, i) => ({
    id: i + 1,
    no: i + 1,
    nama: `Peserta ${String(i + 1).padStart(2, "0")}`,
    nominal: 10000,
    status: i % 3 === 0 ? "sudah" : "belum", // "sudah" | "belum"
    pembayaran: {
      // checklist mingguan contoh (empat minggu)
      w1: i % 2 === 0,
      w2: true,
      w3: i % 3 === 0,
      w4: false,
    },
  }));
}

export const PESERTA =
  globalThis.__SIWASIS_ARISAN__ ?? (globalThis.__SIWASIS_ARISAN__ = seed());
