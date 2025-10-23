export async function GET() {
  const csv =
    "No,Nama,RT,Status,Setoran,Total\n1,Contoh,01,Sudah Dapat,50000,150000\n";
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="rekap-arisan.csv"',
    },
  });
}
