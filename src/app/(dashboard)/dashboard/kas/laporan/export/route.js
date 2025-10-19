export async function GET(req) {
  const csv =
    "Tanggal,Keterangan,Pemasukan,Pengeluaran,Saldo\n2025-01-05,Iuran RT,50000,,50000\n";
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="laporan.csv"`,
    },
  });
}
