import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "https://siwasis.novarentech.web.id/api";
const COOKIE_NAME = "siwasis_token";

export async function POST(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  try {
    if (token) {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    }
  } catch (error) {
    console.warn(
      "Gagal logout dari backend, cookie lokal tetap dihapus:",
      error.message
    );
  }

  cookieStore.delete(COOKIE_NAME);

  return NextResponse.json({ message: "Logout berhasil" });
}
