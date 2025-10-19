import { NextResponse } from "next/server";
import { EP } from "@/lib/endpoints";

export async function POST(req) {
  const body = await req.json();
  const res = await fetch(EP.login(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok || !data.token) {
    return NextResponse.json({ message: "Invalid" }, { status: 401 });
  }
  const resp = NextResponse.json({ ok: true });
  resp.cookies.set("siwasis_token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return resp;
}
