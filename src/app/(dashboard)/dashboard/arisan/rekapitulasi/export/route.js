import { cookies } from "next/headers";
import { API_BASE } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    console.log("[export arisan] handler masuk");

    const cookieStore = cookies();
    const token = cookieStore.get("siwasis_token")?.value;

    if (!token) {
      console.error("[export arisan] token tidak ada");
      return new Response("Unauthorized", { status: 401 });
    }

    if (!API_BASE) {
      console.error("[export arisan] API_BASE tidak terdefinisi");
      return new Response("API base URL is not configured", { status: 500 });
    }

    const incomingUrl = new URL(request.url);
    const searchParams = incomingUrl.searchParams;

    const target = new URL("/arisan/rekap/export", API_BASE);

    searchParams.forEach((value, key) => {
      if (value != null && value !== "") {
        target.searchParams.set(key, value);
      }
    });

    console.log("[export arisan] call BE:", target.toString());

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
      'attachment; filename="arisan-rekap.xlsx"';

    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
      status: res.status,
      headers: {
        "content-type": contentType,
        "content-disposition": contentDisposition,
      },
    });
  } catch (error) {
    console.error("[export arisan] error:", error);
    return new Response("Gagal mengunduh file arisan.", { status: 500 });
  }
}
