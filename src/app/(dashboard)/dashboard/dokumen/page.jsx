// src/app/(dashboard)/dashboard/dokumen/page.jsx
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import { Surface } from "@/components/Surface";
import { absoluteUrl } from "@/lib/absolute-url";

export const revalidate = 0;

export default async function DokumenPage() {
 // Fetch list (guarded)
 const url = await absoluteUrl("/api/mock/docs");
 let rows = [];
 try {
 const res = await fetch(url, { cache: "no-store" });
 if (!res.ok) throw new Error(`HTTP ${res.status}`);
 const json = await res.json();
 rows = json?.rows ?? [];
 } catch {
 rows = [];
 }

 return (
 // ⬇️ inilah wrapper Tailwind yang kumaksud (spacing antar blok)
 <div className="space-y-6">
 <PageHeader
 breadcrumb={
 <Breadcrumbs
 items={[
 { label: "Dashboard", href: "/dashboard" },
 { label: "Dokumen" },
 ]}
 />
 }
 title="Dokumen Desa"
 subtitle="Unggah & kelola dokumen (RAB, laporan, dsb.)"
 actions={<Button variant="ghost">Unduh Semua</Button>}
 />

 {/* ⬇️ grid 2 kolom besar + 1 kolom form di kanan */}
 <div className="grid gap-6 lg:grid-cols-3">
 {/* daftar dokumen */}
 <Surface className="lg:col-span-2">
 <div className="p-4">
 <h3 className="mb-3 text-sm font-medium text-neutral-700">
 Daftar Dokumen
 </h3>
 <ul className="divide-y">
 {rows.map((d) => (
 <li
 key={d.id}
 className="flex items-center justify-between gap-3 py-3"
 >
 <div className="min-w-0">
 <p className="truncate text-sm font-medium">{d.title}</p>
 <p className="truncate text-xs text-neutral-500">
 {d.description}
 </p>
 </div>
 <div className="flex shrink-0 items-center gap-3">
 <a
 href={`/api/mock/docs/${d.id}/file?download=1`}
 className="text-sm text-brand hover:underline"
 >
 Unduh
 </a>
 </div>
 </li>
 ))}
 {rows.length === 0 && (
 <li className="py-10 text-center text-sm text-neutral-500">
 Belum ada dokumen
 </li>
 )}
 </ul>
 </div>
 </Surface>

 {/* panel unggah */}
 <Surface>
 <form
 className="space-y-3 p-4"
 action="/api/mock/docs"
 method="post"
 encType="multipart/form-data"
 >
 <h3 className="text-sm font-medium text-neutral-700">
 Unggah Dokumen
 </h3>
 <input
 name="title"
 placeholder="Nama Dokumen"
 className="w-full rounded-lg border px-3 py-2 text-sm"
 />
 <textarea
 name="description"
 placeholder="Keterangan"
 className="h-24 w-full rounded-lg border px-3 py-2 text-sm"
 />
 <input type="file" name="file" className="w-full text-sm" />
 <div className="pt-1">
 <Button type="submit" className="w-full">
 Unggah
 </Button>
 </div>
 </form>
 </Surface>
 </div>
 </div>
 );
}