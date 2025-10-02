import Bento from "@/components/Bento";
import { absoluteUrl } from "@/lib/absolute-url";

export default async function DashboardHome() {
 const url = await absoluteUrl("/api/mock/metrics"); // ⟵ await di sini
 const res = await fetch(url, { cache: "no-store" });
 const data = await res.json();

 return (
 <div className="space-y-6">
 <Bento data={data} />
 <section className="rounded-xl border bg-white p-4">
 <h2 className="text-base font-semibold">Aktivitas Terbaru</h2>
 <p className="text-sm opacity-70">
 Nanti diisi log kas/arisan/dokumen, dsb.
 </p>
 </section>
 </div>
 );
}
