export async function GET(req) {
  const csv = "No,Nama,RT,Setoran,Total\n1,Contoh,01,50000,150000\n";

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rekap.csv"`,
    },
  });
}
