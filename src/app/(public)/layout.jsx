import { getAdminProfile } from "@/lib/session";
import PublicNavbar from "@/components/PublicNavbar";
import Footer from "@/components/Footer";

export default async function PublicLayout({ children }) {
  const profile = await getAdminProfile();
  return (
    <div className="w-full">
      <PublicNavbar profile={profile} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
