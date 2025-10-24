// Server Component
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function DashboardIndex() {
  redirect("/dashboard/kas/rekapitulasi");
}
