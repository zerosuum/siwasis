import { cookies } from "next/headers";
import { API_BASE } from "@/server/queries/_api";

const COOKIE_NAME = "siwasis_token";

export async function getSessionToken() {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get(COOKIE_NAME);

  return sessionCookie ? sessionCookie.value : null;
}

export async function getAdminProfile() {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  try {
    const res = await fetch(`${API_BASE}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store", 
    });

    if (!res.ok) {
      console.error(`Gagal fetch profil: ${res.status}`);
      return null;
    }

    const profile = await res.json();
    return profile;
  } catch (error) {
    console.error("Gagal fetch admin profile:", error);
    return null;
  }
}
