export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Agent as UndiciAgent } from "undici";

const API_BASE_URL = (
  process.env.API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://siwasis.novarentech.web.id/api"
).replace(/\/+$/, "");
const COOKIE_NAME = "siwasis_token";

const dispatcher = new UndiciAgent({
  connect: { rejectUnauthorized: false, timeout: 15_000 },
  maxSockets: 20,
});

async function fetchWithRetries(
  url,
  init = {},
  { attempts = 2, perAttemptTimeout = 8_000, backoff = 300 } = {}
) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), perAttemptTimeout);
    try {
      const res = await fetch(url, {
        ...init,
        signal: controller.signal,
        dispatcher,
        cache: "no-store",
      });
      clearTimeout(timer);
      if (res.status >= 500 && res.status < 600 && i < attempts - 1) {
        await new Promise((r) => setTimeout(r, backoff * (i + 1)));
        continue;
      }
      return res;
    } catch (e) {
      clearTimeout(timer);
      lastErr = e;
      if (i < attempts - 1)
        await new Promise((r) => setTimeout(r, backoff * (i + 1)));
      else throw e;
    }
  }
  throw lastErr;
}

async function readJsonSafe(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  const text = await res.text().catch(() => "");
  const err = new Error(text || "Bad response (non-JSON)");
  err.status = res.status;
  err.nonJson = true;
  throw err;
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    const { email, password } = body || {};
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const url = `${API_BASE_URL}/login`;
    const res = await fetchWithRetries(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const ct = res.headers.get("content-type") || "";
      let msg = "Server login bermasalah.";
      let status = res.status;

      if (ct.includes("application/json")) {
        const data = await res.json().catch(() => null);
        if (data?.message) msg = data.message;
      } else {
        const text = await res.text().catch(() => "");
        console.error("Login backend non-JSON:", res.status, text);
      }

      if (![400, 401, 422].includes(status)) {
        status = 502;
      }

      return NextResponse.json({ message: msg }, { status });
    }

    const data = await readJsonSafe(res);

    const token = data?.token || data?.data?.token || null;
    const admin = data?.admin || data?.data || data;

    if (!token) {
      console.error("Login OK tapi token missing:", data);
      return NextResponse.json(
        { message: "Token tidak diterima dari backend." },
        { status: 502 }
      );
    }

    const jar = await cookies();
    jar.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json(admin);
  } catch (error) {
    console.error("Error di /api/session/login:", error?.message || error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal." },
      { status: 500 }
    );
  }
}
