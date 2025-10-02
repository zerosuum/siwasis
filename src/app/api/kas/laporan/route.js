import { NextResponse } from "next/server";

// Fungsi helper untuk format Rupiah
const rp = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

// Data dummy yang sudah diperbanyak
const dummyData = {
  rows: [
    {
      id: 1,
      tanggal: "2025-09-01",
      keterangan: "Iuran rutin kas pemuda minggu I",
      pemasukan: 350000,
      pengeluaran: 0,
      saldo: 5350000,
    },
    {
      id: 2,
      tanggal: "2025-09-04",
      keterangan: "Pembelian perlengkapan rapat pemuda (ATK)",
      pemasukan: 0,
      pengeluaran: 120000,
      saldo: 5230000,
    },
    {
      id: 3,
      tanggal: "2025-09-08",
      keterangan: "Donasi dari warga",
      pemasukan: 500000,
      pengeluaran: 0,
      saldo: 5730000,
    },
    {
      id: 4,
      tanggal: "2025-09-11",
      keterangan: "Biaya konsumsi rapat bulanan pemuda",
      pemasukan: 0,
      pengeluaran: 250000,
      saldo: 5480000,
    },
    {
      id: 5,
      tanggal: "2025-09-13",
      keterangan: "Pembelian sound system untuk kegiatan",
      pemasukan: 0,
      pengeluaran: 1200000,
      saldo: 4280000,
    },
    {
      id: 6,
      tanggal: "2025-09-15",
      keterangan: "Iuran rutin kas pemuda minggu III",
      pemasukan: 370000,
      pengeluaran: 0,
      saldo: 4650000,
    },
    {
      id: 7,
      tanggal: "2025-09-17",
      keterangan: "Pembayaran sewa tenda acara 17 Agustus",
      pemasukan: 0,
      pengeluaran: 800000,
      saldo: 3850000,
    },
    {
      id: 8,
      tanggal: "2025-09-21",
      keterangan: "Biaya dekorasi lomba 17 Agustus",
      pemasukan: 0,
      pengeluaran: 650000,
      saldo: 3200000,
    },
    {
      id: 9,
      tanggal: "2025-09-23",
      keterangan: "Sumbangan sponsor acara HUT Desa",
      pemasukan: 1000000,
      pengeluaran: 0,
      saldo: 4200000,
    },
    {
      id: 10,
      tanggal: "2025-09-25",
      keterangan: "Biaya transportasi kegiatan bakti sosial pemuda",
      pemasukan: 0,
      pengeluaran: 200000,
      saldo: 4000000,
    },
    {
      id: 11,
      tanggal: "2025-09-27",
      keterangan: "Hasil penjualan kaos pemuda",
      pemasukan: 750000,
      pengeluaran: 0,
      saldo: 4750000,
    },
    {
      id: 12,
      tanggal: "2025-09-29",
      keterangan: "Hasil penjualan bazar pemuda",
      pemasukan: 500000,
      pengeluaran: 0,
      saldo: 5250000,
    },
    {
      id: 13,
      tanggal: "2025-10-01",
      keterangan: "Pembelian banner",
      pemasukan: 0,
      pengeluaran: 250000,
      saldo: 5000000,
    },
    {
      id: 14,
      tanggal: "2025-10-03",
      keterangan: "Pembelian bola voli & net",
      pemasukan: 0,
      pengeluaran: 450000,
      saldo: 4550000,
    },
    {
      id: 15,
      tanggal: "2025-10-05",
      keterangan: "Sumbangan sponsor",
      pemasukan: 1000000,
      pengeluaran: 0,
      saldo: 5550000,
    },
  ],
  total: 50, // Total data kita set 50, agar pagination tetap berfungsi
  page: 1,
  perPage: 15,
  kpi: {
    pemasukan: 5850000,
    pengeluaran: 2350000,
    saldo: 3500000,
  },
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || 1;

  const responseData = {
    ...dummyData,
    page: Number(page),
    kpi: {
      pemasukanFormatted: rp(dummyData.kpi.pemasukan),
      pengeluaranFormatted: rp(dummyData.kpi.pengeluaran),
      saldoFormatted: rp(dummyData.kpi.saldo),
      rangeLabel: "1 September 2025 - 30 September 2025",
    },
  };

  return NextResponse.json(responseData);
}
