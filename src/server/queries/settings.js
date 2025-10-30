const RAW_API =
  process.env.NEXT_PUBLIC_API_BASE || process.env.API_BASE || "/api";

const ORIGIN =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_ORIGIN ||
      "http://localhost:3000"
    : window.location.origin;

export const API_BASE = RAW_API.replace(/\/+$/, "");

function makeURL(path) {
  if (/^https?:\/\//i.test(path)) return new URL(path);
  return new URL(path, ORIGIN);
}
function setParams(url, params = {}) {
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "")
      url.searchParams.set(k, String(v));
  }
  return url;
}

export async function getAdmins({ page = 1, perPage = 20, q = "" } = {}) {
  const url = makeURL(`${API_BASE}/admins`);
  setParams(url, { page, limit: perPage, q });
  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createAdmin(payload) {
  const res = await fetch(makeURL(`${API_BASE}/admins`).toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); 
}

export async function deleteAdmin(id) {
  const res = await fetch(makeURL(`${API_BASE}/admins/${id}`).toString(), {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); 
}
export async function getProfile() {
  const res = await fetch(makeURL(`${API_BASE}/profile`).toString(), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); 
}

export async function updateProfile(payload) {
  const res = await fetch(makeURL(`${API_BASE}/profile`).toString(), {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function changePassword(payload) {
  const res = await fetch(makeURL(`${API_BASE}/password/change`).toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); 
}
