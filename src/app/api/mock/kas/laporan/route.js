// src/app/api/mock/kas/laporan/route.js

import { NextResponse } from "next/server";

// Data dummy untuk simulasi
const dummyData = {
  rows: [
    {
      id: 1,
      tanggal: "2025-10-01",
      keterangan: "Iuran rutin kas pemuda minggu I",
      pemasukan: 350000,
      pengeluaran: 0,
      saldo: 5350000,
    },
    {
      id: 2,
      tanggal: "2025-10-04",
      keterangan: "Pembelian perlengkapan rapat pemuda (ATK)",
      pemasukan: 0,
      pengeluaran: 120000,
      saldo: 5230000,
    },
    {
      id: 3,
      tanggal: "2025-10-08",
      keterangan: "Donasi dari warga",
      pemasukan: 500000,
      pengeluaran: 0,
      saldo: 5730000,
    },
    {
      id: 4,
      tanggal: "2025-10-11",
      keterangan: "Biaya konsumsi rapat bulanan pemuda",
      pemasukan: 0,
      pengeluaran: 250000,
      saldo: 5480000,
    },
    {
      id: 5,
      tanggal: "2025-10-13",
      keterangan: "Pembelian sound system untuk kegiatan",
      pemasukan: 0,
      pengeluaran: 1200000,
      saldo: 4280000,
    },
  ],
  total: 50, // Total data dummy
  page: 1,
  perPage: 15,
  kpi: {
    pemasukan: 5850000,
    pengeluaran: 2350000,
    saldo: 3500000,
  },
};

export async function GET(request) {
  // Di sini Anda bisa menambahkan logika untuk mengambil data dari database
  // Untuk sekarang, kita kembalikan data dummy saja.

  // Simulasi mengambil query params seperti 'page' jika ada
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || 1;

  const responseData = {
    ...dummyData,
    page: Number(page),
  };

  return NextResponse.json(responseData);
}
