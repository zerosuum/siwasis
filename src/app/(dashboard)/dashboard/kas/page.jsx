import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import { Surface } from "@/components/Surface";
import { absoluteUrl } from "@/lib/absolute-url";
import { rupiah, shortDate } from "@/lib/format";

export const revalidate = 0; // data dinamis (mock)

export default async function KasLaporanPage({ searchParams }) {
 const sp = await searchParams;
 const month = sp?.month ?? ""; // "2025-09" (opsional)
 const page = Number(sp?.page ?? 1);
 const limit = Number(sp?.limit ?? 10);

 const qs = new URLSearchParams();
 qs.set("page", String(page));
 qs.set("limit", String(limit));
 if (month) qs.set("month", month);

 const url = await absoluteUrl(`/api/mock/kas?${qs.toString()}`);
 const res = await fetch(url, { cache: "no-store" });
 const { rows, summary, total } = await res.json();

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
 <div className="mt-1 font-semibold tabular-nums">
 {rupiah(summary.pemasukan)}
 </div>
 </div>
 </Surface>
 <Surface>
 <div className="p-4">
 <div className="text-xs text-neutral-500">Pengeluaran</div>
 <div className="mt-1 font-semibold tabular-nums">
 {rupiah(summary.pengeluaran)}
 </div>
 </div>
 </Surface>
 <Surface>
 <div className="p-4">
 <div className="text-xs text-neutral-500">Saldo</div>
 <div className="mt-1 font-semibold tabular-nums">
 {rupiah(summary.saldo)}
 </div>
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
 {rows.map((r, i) => (
 <tr key={r.id} className="[&_td]:px-4 [&&_td]:py-3">
 <td className="text-neutral-500">
 {(page - 1) * limit + i + 1}
 </td>
 <td>{shortDate(r.tanggal)}</td>
 <td>{r.keterangan}</td>
 <td className="text-right tabular-nums">
 {r.tipe === "pemasukan" ? rupiah(r.nominal) : "-"}
 </td>
 <td className="text-right tabular-nums">
 {r.tipe === "pengeluaran" ? rupiah(r.nominal) : "-"}
 </td>
 <td className="text-right w-0 whitespace-nowrap">
 <Button variant="ghost" size="sm" className="px-2">
 Edit
 </Button>
 <Button variant="ghost" size="sm" className="px-2">
 Hapus
 </Button>
 </td>
 </tr>
 ))}
 {rows.length === 0 && (
 <tr>
 <td
 colSpan={6}
 className="px-4 py-10 text-center text-neutral-500"
 >
 Tidak ada data
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </Surface>

 {/* Pagination very-light (pakai yang kamu punya kalau sudah) */}
 <div className="text-sm text-neutral-500">Total: {total} data</div>
 </div>
 );
}
