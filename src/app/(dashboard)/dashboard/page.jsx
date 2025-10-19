// Server Component
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // optional

export default function DashboardIndex() {
  // Arahkan dashboard root ke rekapitulasi
  redirect("/dashboard/kas/rekapitulasi");
  // (Tidak perlu return; redirect akan mengakhiri rendering)
}
