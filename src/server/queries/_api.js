import { cookies } from "next/headers";

import { API_PROXY_BASE, API_BASE } from "@/lib/config";

const COOKIE_NAME = "siwasis_token";
const ORIGIN =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_SITE_ORIGIN ||
      "http://localhost:3000"
    : window.location.origin;

export function makeURL(path) {
  if (/^https?:\/\//i.test(path)) return new URL(path);
  return new URL(path, ORIGIN);
}

export function setParams(url, params = {}) {
  for (const [k, v] of Object.entries(params || {})) {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  }
  return url;
}

async function fetchWithTimeout(url, init = {}, { attempts = 2, timeoutMs = 5000, backoff = 400 } = {}) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...init, signal: ctrl.signal, cache: "no-store" });
      clearTimeout(t);
      return res;
    } catch (e) {
      clearTimeout(t);
      lastErr = e;
      if (i < attempts - 1) await new Promise(r => setTimeout(r, backoff * (i + 1)));
    }
  }
  throw lastErr;
}

export async function proxyJSON(
  path,
  { method = "GET", params, json, formData, headers, attempts = 2, timeoutMs = 5000, tags = [] } = {}
) {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;

  const url = new URL(`${API_PROXY_BASE}/${String(path).replace(/^\/+/, "")}`, ORIGIN);
  if (params) setParams(url, params);

  const init = {
    method,
    headers: {
      Accept: "application/json",
      ...(headers || {}),
      ...(token
        ? {
            cookie: `${COOKIE_NAME}=${token}`,
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
    next: { tags },
  };

  if (formData) {
    init.body = formData;
  } else if (json !== undefined) {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(json);
  }

  const res = await fetchWithTimeout(url.toString(), init, { attempts, timeoutMs });
  const ct = res.headers.get("content-type") || "";
  if (!res.ok || !ct.includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new Error(`Proxy fetch failed (${res.status}): ${text || "Bad response"}`);
  }
  return res.json();
}

export function normalizePayload(payload) {
  if (payload == null) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (payload?.data !== undefined) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return payload;
}

export async function fetchFirstData(paths, options) {
  const list = Array.isArray(paths) ? paths : [paths];
  for (const p of list) {
    try {
      const data = await proxyJSON(p, options);
      const norm = normalizePayload(data);

      if (
        (Array.isArray(norm) && norm.length > 0) ||
        (!Array.isArray(norm) && norm && Object.keys(norm).length > 0)
      ) {
        return norm;
      }
    } catch (_e) {
      continue;
    }
  }
  return [];
}

export async function hasEndpoint(path) {
  try {
    await proxyJSON(path, { method: "GET", params: { _t: Date.now() } });
    return true;
  } catch {
    return false;
  }
}

export async function hasAnyEndpoint(paths = [], { viaProxy = true } = {}) {
  const list = Array.isArray(paths) ? paths : [paths];

  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  const headers =
    viaProxy && token ? { cookie: `${COOKIE_NAME}=${token}` } : {};

  for (const p of list) {
    try {
      const url = viaProxy ? `${API_PROXY_BASE}${p}` : `${API_BASE}${p}`;
      const res = await fetch(url, { cache: "no-store", headers });
      if (res.ok) return true;
    } catch {
    }
  }
  return false;
}