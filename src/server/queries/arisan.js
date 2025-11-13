import { proxyJSON } from "./_api";

export async function getArisanRekap({
  page,
  year,
  q,
  rt,
  from,
  to,
  min,
  max,
} = {}) {
  return proxyJSON("/arisan/rekap", {
    params: { page, year, q, rt, from, to, min, max },
  });
}

export async function getSpinCandidates({ year, rt } = {}) {
  return proxyJSON("/arisan/spin/candidates", { params: { year, rt } });
}

export async function postSpinDraw({ wargaId, tanggal, year }) {
  return proxyJSON("/arisan/spin/draw", {
    method: "POST",
    json: { wargaId, tanggal, year },
  });
}

export async function saveArisanRekap({ year, updates, from, to }) {
  const fd = new FormData();
  fd.append("payload", JSON.stringify({ year, updates, from, to }));
  return proxyJSON("/arisan/rekap/save", { method: "POST", formData: fd });
}
