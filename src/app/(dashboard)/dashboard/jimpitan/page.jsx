import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import SectionCards from "@/components/SectionCards";
import { Surface } from "@/components/Surface";
import { absoluteUrl } from "@/lib/absolute-url";
import { rupiah, shortDate } from "@/lib/format";

export const revalidate = 0;

export default async function JimpitanPage({ searchParams }) {
 // WAJIB await (Next 15 dynamic APIs)
 const sp = await searchParams;
 const page = Number(sp?.page ?? 1);
 const limit = Number(sp?.limit ?? 10);

 const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
 const url = await absoluteUrl(`/api/mock/jimpitan?${qs.toString()}`);

 // ==== FETCH DEFENSIF (JANGAN DIGANDAKAN) ====
 let rows = [];
 let total = 0;
 let summary = { pemasukan: 0, pengeluaran: 0, saldo: 0 };

 try {
 const res = await fetch(url, { cache: "no-store" });
 if (!res.ok) throw new Error(`HTTP ${res.status}`);
 const json = await res.json();
 rows = json?.rows ?? [];
 total = json?.total ?? 0;
 summary = json?.summary ?? summary;
 } catch (e) {
 // Biarkan nilai default -> UI tampil empty state, tidak meledak.
 // console.error("Jimpitan API error:", e);
 }

 return (
 <div className="space-y-6">
 <PageHeader
 breadcrumb={
 <Breadcrumbs
 items={[
 { label: "Dashboard", href: "/dashboard" },
 { label: "Jimpitan" },
 ]}
 />
 }
 title="Laporan Keuangan Jimpitan"
 subtitle="Transparansi pemasukan & pengeluaran jimpitan"
 actions={
 <div className="flex items-center gap-2">
 <Button variant="outline">+ Pengeluaran</Button>
 <Button variant="solid">+ Pemasukan</Button>
 <Button variant="ghost">Unduh</Button>
 </div>
 }
 />

 <SectionCards
 items={[
 { label: "Pemasukan", value: rupiah(summary.pemasukan) },
 { label: "Pengeluaran", value: rupiah(summary.pengeluaran) },
 { label: "Saldo", value: rupiah(summary.saldo) },
 ]}
 />

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
 <td>{r.tanggal ? shortDate(r.tanggal) : "-"}</td>
 <td>{r.keterangan}</td>
 <td className="text-right tabular-nums">
 {r.tipe === "pemasukan" ? rupiah(r.nominal) : "-"}
 </td>
 <td className="text-right tabular-nums">
 {r.tipe === "pengeluaran" ? rupiah(r.nominal) : "-"}
 </td>
 <td className="w-0 whitespace-nowrap text-right">
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

 <div className="text-sm text-neutral-500">Total: {total} data</div>
 </div>
 );
}
