import DashboardToastProvider from "./ToastProviderClient";
import DashboardShell from "./DashboardShell"; 
import { getAdminProfile } from "@/lib/session"; 

export default async function AdminLayout({ children }) {
  const profile = await getAdminProfile();

  return (
    <DashboardToastProvider>
      <DashboardShell profile={profile}>{children}</DashboardShell>
    </DashboardToastProvider>
  );
}
