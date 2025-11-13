import { Agent as UndiciAgent } from "undici";

export const dispatcher = new UndiciAgent({
  connect: { rejectUnauthorized: false, timeout: 15_000 },
  keepAliveTimeout: 10_000,
  keepAliveMaxTimeout: 60_000,
  maxSockets: 10,
  pipelining: 1,
});

export async function fetchWithRetries(
  url,
  init = {},
  { attempts = 2, perAttemptTimeout = 8000, baseDelay = 300 } = {}
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
      });
      clearTimeout(timer);
      if (res.status >= 500 && i < attempts - 1) {
        await new Promise((r) => setTimeout(r, baseDelay * (i + 1)));
        continue;
      }
      return res;
    } catch (e) {
      clearTimeout(timer);
      lastErr = e;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, baseDelay * (i + 1)));
        continue;
      }
      throw e;
    }
  }
  throw lastErr;
}

export async function readJsonSafe(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  const text = await res.text().catch(() => "");
  const err = new Error(text || "Bad response (non-JSON)");
  err.status = res.status;
  err.nonJson = true;
  throw err;
}
