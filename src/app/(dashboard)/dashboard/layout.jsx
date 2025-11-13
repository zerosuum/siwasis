import DashboardToastProvider from "./ToastProviderClient";
import DashboardShell from "./DashboardShell";
import { getProfile } from "@/server/queries/settings";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const profileRes = await getProfile().catch(() => null);
  const raw = profileRes?.data ?? profileRes ?? null;

  const apiOrigin =
    (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/api$/, "") ||
    "https://siwasis.novarentech.web.id";

  const profile = raw
    ? {
        ...raw,
        photo_url: raw.photo
          ? `${apiOrigin}/storage/profile/${raw.photo}`
          : null,
      }
    : null;

  return (
      <DashboardShell profile={profile}>{children}</DashboardShell>
  );
}
