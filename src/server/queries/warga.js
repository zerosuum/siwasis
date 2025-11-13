import { proxyJSON } from "./_api";

// LIST + filter
export async function getWarga(_tokenIgnored, opts = {}) {
  const {
    page,
    q,
    rt,
    role,
    dob_from,
    dob_to,
    kas_only,
    arisan_only,
    perPage,
    kas_min,
    kas_max,
    arisan_min,
    arisan_max,
    arisan_status,
  } = opts;

  const isNum = (v) =>
    v !== "" && v !== null && v !== undefined && !Number.isNaN(Number(v));

  return proxyJSON("/warga", {
    params: {
      page,
      q,
      rt: rt && rt !== "all" ? rt : undefined,
      role,
      dob_from,
      dob_to,
      kas_only: kas_only ? 1 : undefined,
      arisan_only: arisan_only ? 1 : undefined,
      arisan_status,
      per_page: perPage,
      kas_min: isNum(kas_min) ? Number(kas_min) : undefined,
      kas_max: isNum(kas_max) ? Number(kas_max) : undefined,
      arisan_min: isNum(arisan_min) ? Number(arisan_min) : undefined,
      arisan_max: isNum(arisan_max) ? Number(arisan_max) : undefined,
    },
  });
}

// CREATE
export async function createWarga(_tokenIgnored, payload, variant) {
  let endpoint;
  if (variant === "KAS") endpoint = "/warga/kas";
  else if (variant === "ARISAN") endpoint = "/warga/arisan";
  else throw new Error(`Variant tidak dikenal untuk create: ${variant}`);

  return proxyJSON(endpoint, { method: "POST", json: payload });
}

export async function updateWarga(_tokenIgnored, id, payload) {
  return proxyJSON(`/warga/${id}`, { method: "PUT", json: payload });
}

export async function deleteWarga(_tokenIgnored, id) {
  return proxyJSON(`/warga/${id}`, { method: "DELETE" });
}

export async function addKasMember(_tokenIgnored, { warga_id }) {
  return proxyJSON("/warga/kas", { method: "POST", json: { warga_id } });
}

export async function addArisanMember(_tokenIgnored, { warga_id }) {
  return proxyJSON("/warga/arisan", { method: "POST", json: { warga_id } });
}
