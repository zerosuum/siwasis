export async function GET(req) {
  // sementara stub; ganti ke proxy BE kalau endpoint sudah ada
  const csv =
    "Tanggal,Keterangan,Pemasukan,Pengeluaran,Saldo\n2025-01-05,Sampah RT,50000,,50000\n";
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="laporan-sampah.csv"`,
    },
  });
}
