import { getProfile, getAdmins } from "@/server/queries/settings";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const profileData = getProfile().catch(() => null);
  const adminsData = getAdmins({ page: 1, perPage: 50 }).catch(() => ({
    rows: [],
  }));

  const [profile, admins] = await Promise.all([profileData, adminsData]);

  return (
    <SettingsClient
      initialProfile={profile}
      initialAdmins={admins.rows ?? []}
    />
  );
}
