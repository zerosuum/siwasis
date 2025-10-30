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

// LIST + filter
export async function getWarga(opts = {}) {
  const {
    page, q, rt, role, dob_from, dob_to,
    kas_only, arisan_only, perPage,
    kas_min, kas_max, arisan_min, arisan_max,
  } = opts;

   const url = makeURL(`${API_BASE}/warga`);

  const isNum = (v) =>
    v !== "" && v !== null && v !== undefined && !Number.isNaN(Number(v));
  setParams(url, {
    page,
    q,
    rt: rt && rt !== "all" ? rt : undefined,
    role,
    dob_from,
    dob_to,
    kas_only: kas_only ? 1 : undefined,
    arisan_only: arisan_only ? 1 : undefined,
    limit: perPage,
    kas_min: isNum(kas_min) ? Number(kas_min) : undefined,
    kas_max: isNum(kas_max) ? Number(kas_max) : undefined,
    arisan_min: isNum(arisan_min) ? Number(arisan_min) : undefined,
    arisan_max: isNum(arisan_max) ? Number(arisan_max) : undefined,
  });

  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    // baca body
    let more = "";
    try { more = ` — ${await res.text()}`; } catch {}
    throw new Error(`HTTP ${res.status} ${res.statusText}${more}`);
  }
  return res.json();
}

// CRUD
export async function createWarga(payload) {
  const url = makeURL(`${API_BASE}/warga`);
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function updateWarga(id, payload) {
  const url = makeURL(`${API_BASE}/warga/${id}`);
  const res = await fetch(url.toString(), {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteWarga(id) {
  const url = makeURL(`${API_BASE}/warga/${id}`);
  const res = await fetch(url.toString(), {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function addKasMember(warga_id) {
  const res = await fetch(makeURL(`${API_BASE}/kas/members`).toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ warga_id }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function addArisanMember(warga_id) {
  const res = await fetch(makeURL(`${API_BASE}/arisan/members`).toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ warga_id }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
