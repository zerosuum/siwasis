// src/app/api/mock/kas/store.mjs
function seed() {
  return Array.from({ length: 87 }).map((_, i) => {
    const day = (i % 28) + 1;
    const month = (i % 12) + 1;
    const pad = (n) => String(n).padStart(2, "0");
    const tanggal = `2025-${pad(month)}-${pad(day)}`;
    const tipe = i % 3 === 0 ? "pemasukan" : "pengeluaran";
    const nominal = tipe === "pemasukan" ? 150000 + i * 1000 : 80000 + i * 500;
    return {
      id: i + 1,
      tanggal,
      keterangan: `Transaksi #${i + 1}`,
      tipe,
      nominal,
    };
  });
}
export const DATA =
  globalThis.__SIWASIS_KAS__ ?? (globalThis.__SIWASIS_KAS__ = seed());
