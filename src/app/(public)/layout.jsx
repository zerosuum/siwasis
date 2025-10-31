import { getAdminProfile } from "@/lib/session";
import PublicNavbar from "@/components/PublicNavbar";

export default async function PublicLayout({ children }) {
  const profile = await getAdminProfile();

  return (
    <div>
      <PublicNavbar profile={profile} />
      <main>{children}</main>
    </div>
  );
}
