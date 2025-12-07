import { cookies } from "next/headers";
import { proxyJSON } from "@/server/queries/_api";

const COOKIE_NAME = "siwasis_token";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://siwasis.novarentech.web.id/api";
const API_ORIGIN = API_BASE.replace(/\/api$/, "");
const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000";

export async function getSessionToken() {
  const jar = await cookies();
  return jar.get(COOKIE_NAME)?.value || null;
}

export async function isLoggedIn() {
  return !!(await getSessionToken());
}

const _profileCache = new Map();
function setCache(key, val) {
  _profileCache.set(key, { at: Date.now(), val });
}
function getCache(key, ttl = 5000) {
  const hit = _profileCache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > ttl) return null;
  return hit.val;
}

export async function getAdminProfile() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value || null;
  if (!token) return null;

  const cacheKey = `profile:${token}`;
  const cached = getCache(cacheKey);
  if (cached !== null) return cached;

  try {
    const payload = await proxyJSON("/profile", {
      attempts: 1,
      timeoutMs: 5000,
    }).catch(() => null);

    const raw =
      payload?.data ??
      payload?.user ??
      (typeof payload === "object" ? payload : null);

    if (!raw || typeof raw !== "object") return null;

    const msg = String(raw.message || payload?.message || "").toLowerCase();
    if (msg.includes("unauth")) {
      return null;
    }

    const API_BASE =
      process.env.NEXT_PUBLIC_API_BASE ||
      "https://siwasis.novarentech.web.id/api";
    const API_ORIGIN = API_BASE.replace(/\/api$/, "");

    const photo = raw.photo ?? null;
    const photo_url = photo ? `${API_ORIGIN}/storage/profile/${photo}` : null;

    const profile = {
      id: raw.id ?? null,
      name: raw.name ?? "",
      email: raw.email ?? "",
      role: (raw.role ?? "admin") || "admin",
      is_admin:
        typeof raw.is_admin === "boolean"
          ? raw.is_admin
          : (raw.role ?? "").toLowerCase() === "admin",
      photo,
      photo_url,
      created_at: raw.created_at ?? null,
    };

    setCache(cacheKey, profile);
    return profile;
  } catch (e) {
    console.error("Gagal fetch profil:", e);
    return null;
  }
}
