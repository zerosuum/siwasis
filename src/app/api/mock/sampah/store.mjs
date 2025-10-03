function seed() {
  return Array.from({ length: 87 }).map((_, i) => {
    const day = (i % 28) + 1;
    const month = (i % 12) + 1;
    const pad = (n) => String(n).padStart(2, "0");
    const tanggal = `2025-${pad(month)}-${pad(day)}`;
    const tipe = i % 3 === 0 ? "pemasukan" : "pengeluaran";
    const nominal =
      tipe === "pemasukan" ? 150_000 + i * 1000 : 80_000 + i * 500;
    return {
      id: i + 1,
      tanggal,
      keterangan: `Transaksi Sampah #${i + 1}`,
      tipe,
      nominal,
    };
  });
}

// Pakai globalThis supaya DATA tetap ada antar request di dev
export const DATA =
  globalThis.__SIWASIS_SAMPAH__ ?? (globalThis.__SIWASIS_SAMPAH__ = seed());
