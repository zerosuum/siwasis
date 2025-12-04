import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("siwasis_token")?.value;

    if (!token) {
      console.error("[export kas] token tidak ada");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!API_BASE) {
      console.error("[export kas] API_BASE tidak terdefinisi");
      return new NextResponse("API base URL is not configured", {
        status: 500,
      });
    }

    const incomingUrl = new URL(request.url);
    const searchParams = incomingUrl.searchParams;

    const target = new URL("/kas/rekap/export", API_BASE);

    searchParams.forEach((value, key) => {
      if (value != null && value !== "") {
        target.searchParams.set(key, value);
      }
    });

    console.log("[export kas] call:", target.toString());

    const res = await fetch(target.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,application/json,*/*",
      },
    });

    const contentType =
      res.headers.get("content-type") || "application/octet-stream";
    const contentDisposition =
      res.headers.get("content-disposition") ||
      'attachment; filename="kas-rekap.xlsx"';

    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: res.status,
      headers: {
        "content-type": contentType,
        "content-disposition": contentDisposition,
      },
    });
  } catch (error) {
    console.error("[export kas] error:", error);
    return new NextResponse("Gagal mengunduh file kas.", { status: 500 });
  }
}
