import { proxyJSON } from "./_api";

export async function getKasRekap({
  page,
  year,
  q,
  rt,
  from,
  to,
  min,
  max,
} = {}) {
  return proxyJSON("/kas/rekap", {
    params: { page, year, q, rt, from, to, min, max },
  });
}

export async function getKasLaporan({
  page,
  year,
  from,
  to,
  q,
  type,
  min,
  max,
} = {}) {
  return proxyJSON("/kas/laporan", {
    params: { page, year, from, to, q, type, min, max },
  });
}

export async function saveKasRekap(formData /*, tokenIgnored */) {
  return proxyJSON("/kas/rekap/save", { method: "POST", json: formData });
}
