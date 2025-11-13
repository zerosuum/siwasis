import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getProfile, getAdmins } from "@/server/queries/settings";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  // Ambil cookie token
  const cookieStore = await cookies();
  const token = cookieStore.get("siwasis_token")?.value;

  // Redirect ke login kalau belum login
  if (!token) {
    redirect("/login");
  }

  // Ambil data profil dan daftar admin paralel
  const [profileRes, adminsRes] = await Promise.all([
    getProfile().catch((e) => {
      console.error("Gagal ambil profile:", e);
      return null;
    }),
    getAdmins(null, { page: 1, perPage: 50 }).catch((e) => {
      console.error("Gagal ambil admins:", e);
      return { data: [], rows: [] };
    }),
  ]);

  // Normalisasi hasil api
  const initialProfile = profileRes?.data ?? profileRes ?? null;
  const initialAdmins = adminsRes?.data ?? adminsRes?.rows ?? [];

  // Render client component
  return (
    <SettingsClient
      initialProfile={initialProfile}
      initialAdmins={initialAdmins}
    />
  );
}
