// src/app/(dashboard)/dashboard/arisan/page.jsx
import ArisanRekapClient from "./ArisanRekapClient";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionCards from "@/components/SectionCards";
import { absoluteUrl } from "@/lib/absolute-url";
import { rupiah } from "@/lib/format";

export const revalidate = 0;

export default async function ArisanRekapPage({ searchParams }) {
 // ...fetch rows, weeks, summary seperti sebelumnya (tanpa onSaved)
 const sp = await searchParams;
 const page = Number(sp?.page ?? 1);
 const limit = Number(sp?.limit ?? 10);
 const qs = new URLSearchParams({ page: String(page), limit: String(limit) });

 let rows = [],
 weeks = [],
 summary = { pemasukan: 0, pengeluaran: 0, saldo: 0 },
 total = 0;

 try {
 const res = await fetch(await absoluteUrl(`/api/mock/arisan?${qs}`), {
 cache: "no-store",
 });
 if (!res.ok) throw new Error(`HTTP ${res.status}`);
 const json = await res.json();
 rows = json.rows ?? [];
 weeks = json.weeks ?? [];
 summary = json.summary ?? summary;
 total = json.total ?? 0;
 } catch {}

 return (
 <div className="space-y-6">
 <PageHeader
 breadcrumb={
 <Breadcrumbs
 items={[
 { label: "Dashboard", href: "/dashboard" },
 { label: "Arisan" },
 ]}
 />
 }
 title="Arisan – Rekap & Laporan"
 subtitle="Kelola iuran dan status arisan"
 actions={null}
 />

 <SectionCards
 items={[
 { label: "Pemasukan", value: rupiah(summary.pemasukan) },
 { label: "Pengeluaran", value: rupiah(summary.pengeluaran) },
 { label: "Saldo", value: rupiah(summary.saldo) },
 ]}
 />

 {/* Semua yang butuh interaktivitas turun ke client */}
 <ArisanRekapClient rows={rows} weeks={weeks} />
 </div>
 );
}
