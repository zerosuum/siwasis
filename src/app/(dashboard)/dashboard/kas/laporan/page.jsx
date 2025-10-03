import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import { Surface } from "@/components/Surface";

export default async function KasLaporanPage() {
 return (
 <div className="space-y-6">
 <PageHeader
 breadcrumb={
 <Breadcrumbs
 items={[
 { label: "Dashboard", href: "/dashboard" },
 { label: "Kas", href: "/dashboard/kas" },
 { label: "Laporan Keuangan" },
 ]}
 />
 }
 title="Laporan Keuangan Kas"
 subtitle="Kelola pemasukan & pengeluaran bulanan"
 actions={
 <div className="flex items-center gap-2">
 <select className="rounded-lg border px-3 py-2 text-sm">
 <option>September 2025</option>
 </select>
 <Button variant="outline">+ Pengeluaran</Button>
 <Button variant="solid">+ Pemasukan</Button>
 <Button variant="ghost">Unduh</Button>
 </div>
 }
 />

 {/* Ringkasan */}
 <div className="grid gap-4 sm:grid-cols-3">
 <Surface>
 <div className="p-4">
 <div className="text-xs text-neutral-500">Pemasukan</div>
 <div className="mt-1 font-semibold tabular-nums">Rp 0,00</div>
 </div>
 </Surface>
 <Surface>
 <div className="p-4">
 <div className="text-xs text-neutral-500">Pengeluaran</div>
 <div className="mt-1 font-semibold tabular-nums">Rp 0,00</div>
 </div>
 </Surface>
 <Surface>
 <div className="p-4">
 <div className="text-xs text-neutral-500">Saldo</div>
 <div className="mt-1 font-semibold tabular-nums">Rp 0,00</div>
 </div>
 </Surface>
 </div>

 {/* Tabel */}
 <Surface>
 <div className="overflow-auto">
 <table className="min-w-full text-sm">
 <thead className="sticky top-0 z-10 bg-neutral-50 text-neutral-600">
 <tr className="[&_th]:px-4 [&&_th]:py-3 [&&_th]:font-medium">
 <th className="w-0 text-left">No</th>
 <th className="text-left">Tanggal</th>
 <th className="text-left">Keterangan</th>
 <th className="text-right">Pemasukan</th>
 <th className="text-right">Pengeluaran</th>
 <th className="text-right">Aksi</th>
 </tr>
 </thead>
 <tbody className="[&>tr:nth-child(even)]:bg-neutral-50/40">
 <tr>
 <td
 colSpan={6}
 className="px-4 py-10 text-center text-neutral-500"
 >
 Tidak ada data
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </Surface>
 </div>
 );
}
