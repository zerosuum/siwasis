import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import { cls } from "@/lib/format"; // helper join className

export default function ArisanTabsLayout({ children }) {
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

 {/* Tabs ala underline (tanpa lib) */}
 <nav className="border-b">
 <ul className="flex items-center gap-6">
 <Tab href="/dashboard/arisan" label="Rekapitulasi" />
 <Tab href="/dashboard/arisan/spin" label="Spinwheel" />
 </ul>
 </nav>

 {children}
 </div>
 );
}

function Tab({ href, label }) {
 // Next tidak punya usePathname di server—pakai client mini:
 return (
 <Link
 href={href}
 className={cls(
 "inline-block -mb-px border-b-2 border-transparent pb-2 text-sm text-neutral-500 hover:text-neutral-800"
 // active via data attribute dari Next (prefetch) nggak konsisten, jadi biarkan CSS di child page yang “menonjol”
 )}
 data-tab={label}
 >
 {label}
 </Link>
 );
}
