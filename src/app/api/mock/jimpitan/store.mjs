function seed() {
  return Array.from({ length: 87 }).map((_, i) => {
    const day = (i % 28) + 1;
    const month = (i % 12) + 1;
    const pad = (n) => String(n).padStart(2, "0");
    const tanggal = `2025-${pad(month)}-${pad(day)}`;
    const tipe = i % 2 === 0 ? "pemasukan" : "pengeluaran";
    const nominal =
      tipe === "pemasukan" ? 200_000 + i * 1500 : 90_000 + i * 700;
    return {
      id: i + 1,
      tanggal,
      keterangan: `Jimpitan #${i + 1}`,
      tipe, // "pemasukan" | "pengeluaran"
      nominal,
    };
  });
}

export const DATA =
  globalThis.__SIWASIS_JIMPITAN__ ?? (globalThis.__SIWASIS_JIMPITAN__ = seed());
