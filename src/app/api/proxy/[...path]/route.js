export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { Agent as UndiciAgent } from "undici";
import { cookies } from "next/headers";

const SLOW_PATHS = [/^youtube/i, /^video/i, /^documents/i, /^profile/i];
function tuneTimeout(path) {
  if (SLOW_PATHS.some((re) => re.test(path))) {
    return { attempts: 2, baseDelay: 600, perAttemptTimeout: 25_000 };
  }
  return { attempts: 3, baseDelay: 400, perAttemptTimeout: 10_000 };
}

const BACKEND_BASE = (
  process.env.BACKEND_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://siwasis.novarentech.web.id/api"
).replace(/\/+$/, "");

const dispatcher = new UndiciAgent({
  connect: { rejectUnauthorized: false, timeout: 15_000 },
  maxSockets: 20,
});

async function fetchWithRetries(
  url,
  init,
  { attempts = 3, baseDelay = 400, perAttemptTimeout = 10_000 } = {}
) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), perAttemptTimeout);
    try {
      const res = await fetch(url.toString(), {
        ...init,
        signal: controller.signal,
        dispatcher,
        cache: "no-store",
      });
      clearTimeout(timer);
      if (res.status >= 500 && res.status < 600 && i < attempts - 1) {
        await new Promise((r) => setTimeout(r, baseDelay * (i + 1)));
        continue;
      }
      return res;
    } catch (e) {
      clearTimeout(timer);
      lastErr = e;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, baseDelay * (i + 1)));
      } else {
        throw e;
      }
    }
  }
  throw lastErr;
}

function extractPath(req) {
  const u = new URL(req.url);
  return u.pathname.replace(/^\/api\/proxy\/?/, "");
}

async function forward(method, path, req) {
  const jar = await cookies();
  const token = jar.get("siwasis_token")?.value || null;

  const firstSeg = decodeURIComponent(path).split(/[/?]/)[0] || "";
  const timing = tuneTimeout(firstSeg);

  const backendUrl = new URL(`${BACKEND_BASE}/${decodeURIComponent(path)}`);
  const sp = new URL(req.url).searchParams;
  for (const [k, v] of sp.entries()) backendUrl.searchParams.set(k, v);

  let body;
  const ct = req.headers.get("content-type") || "";
  if (["POST", "PUT", "PATCH"].includes(method)) {
    if (ct.includes("multipart/form-data")) body = await req.formData();
    else body = await req.text().catch(() => undefined);
  }

  const headers = { Accept: "application/json" };
  if (ct && !ct.includes("multipart/form-data")) headers["Content-Type"] = ct;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    headers.Cookie = `siwasis_token=${token}`;
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[proxy] BACKEND_BASE:", BACKEND_BASE);
    console.log("[proxy] hit", method, path);
    console.log("[proxy] →", backendUrl.toString());
  }

  const backendHost = backendUrl.hostname;
  const existingNoProxy = process.env.NO_PROXY || process.env.no_proxy || "";
  const mustNoProxy = [backendHost, ".novarentech.web.id"].join(",");
  process.env.NO_PROXY = existingNoProxy
    ? `${existingNoProxy},${mustNoProxy}`
    : mustNoProxy;
  process.env.no_proxy = process.env.NO_PROXY;

  let res;
  try {
    res = await fetchWithRetries(backendUrl, { method, headers, body }, timing);
  } catch (e) {
    const isAbort =
      e?.name === "AbortError" ||
      e?.code === 20 ||
      /aborted|timeout/i.test(String(e?.message || ""));
    if (isAbort) {
      return new Response(
        JSON.stringify({ ok: false, message: "Upstream timeout", path }),
        { status: 504, headers: { "content-type": "application/json" } }
      );
    }

    if (
      process.env.NODE_ENV === "development" &&
      backendUrl.protocol === "https:"
    ) {
      try {
        const httpUrl = new URL(backendUrl);
        httpUrl.protocol = "http:";
        console.warn(
          "[proxy] https failed, retry http fallback →",
          httpUrl.toString()
        );
        res = await fetchWithRetries(
          httpUrl,
          { method, headers, body },
          timing
        );
      } catch {
        return new Response(
          JSON.stringify({ ok: false, message: "Upstream unreachable", path }),
          { status: 502, headers: { "content-type": "application/json" } }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ ok: false, message: "Upstream unreachable", path }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }
  }

  const buf = await res.arrayBuffer();
  const resCT = res.headers.get("content-type") || "application/json";
  const outHeaders = new Headers({ "content-type": resCT });
  const cd = res.headers.get("content-disposition");
  if (cd) outHeaders.set("content-disposition", cd);

  return new Response(buf, { status: res.status, headers: outHeaders });
}

export async function GET(req) {
  return forward("GET", extractPath(req), req);
}
export async function POST(req) {
  return forward("POST", extractPath(req), req);
}
export async function PUT(req) {
  return forward("PUT", extractPath(req), req);
}
export async function PATCH(req) {
  return forward("PATCH", extractPath(req), req);
}
export async function DELETE(req) {
  return forward("DELETE", extractPath(req), req);
}
