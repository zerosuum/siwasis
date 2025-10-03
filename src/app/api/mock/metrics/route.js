export async function GET() {
 // angka dummy harian/mingguan, nanti bisa kamu sambungkan ke backend
 const data = {
 kas: { saldo: 12850000, pemasukan: 3500000, pengeluaran: 1750000 },
 arisan: { peserta: 24, putaran: 8, totalIuran: 4800000 },
 jimpitan: { bulanIni: 720000, ratarataHarian: 24000 },
 sampah: { pemasukan: 360000, transaksi: 42 },
 };
 return Response.json(data);
}
