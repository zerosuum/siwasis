import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("siwasis_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!API_BASE) {
      console.error("[api/profile] API_BASE tidak terdefinisi");
      return NextResponse.json(
        { message: "API base URL is not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    // kirim ke Laravel: /api/profile (route POST -> AuthController@updateProfile)
    const res = await fetch(`${API_BASE}/profile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Content-Type otomatis diset oleh fetch untuk FormData
      },
      body: formData,
    });

    const contentType = res.headers.get("content-type") || "application/json";
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[api/profile] error:", err);
    return NextResponse.json(
      { message: "Gagal menghubungi server profil." },
      { status: 500 }
    );
  }
}
