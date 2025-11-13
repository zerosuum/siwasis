import { getAdminProfile } from "@/lib/session";
import PublicNavbar from "@/components/PublicNavbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PublicLayout({ children }) {
  const profile = await getAdminProfile(); 
  return (
    <div className="min-h-dvh flex flex-col">
      <PublicNavbar profile={profile} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
