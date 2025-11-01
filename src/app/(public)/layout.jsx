import { getAdminProfile } from "@/lib/session";
import PublicNavbar from "@/components/PublicNavbar";
import Footer from "@/components/Footer";

export default async function PublicLayout({ children }) {
  const profile = await getAdminProfile();
  return (
    <div className="w-full min-h-[100svh] flex flex-col">
      <PublicNavbar profile={profile} />
      <main className="w-full flex-1">{children}</main>
      <Footer />
    </div>
  );
}
