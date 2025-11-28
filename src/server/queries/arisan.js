import { proxyJSON } from "./_api";
import { toRp } from "@/lib/format";
import { getPeriodes } from "./periode";

const SPIN_COLORS = [
  "#C7D9B7",
  "#E3EAD6",
  "#F6F0D8",
  "#D2E4F2",
  "#F2DDE1",
  "#F3E1C8",
  "#CFE3DA",
  "#E4D7F2",
  "#D8E2DC",
  "#FFE5D9",
  "#FAE1DD",
  "#F8EDEB",
  "#DDE5B6",
  "#ADC178",
  "#CEE5F2",
  "#ACCBE1",
  "#BFD8B8",
  "#E2ECE9",
  "#D4C1EC",
  "#FFCAB1",
  "#F9DCC4",
  "#C9E4DE",
  "#D4DFE6",
  "#EAD7F6",
  "#E7EFC5",
  "#C2C5AA",
  "#F2C6DE",
  "#E9D8A6",
  "#CCD5AE",
  "#DDE7F0",
];

export async function getArisanRekap({
  page,
  q,
  rt,
  from,
  to,
  min,
  max,
  periode_id,
} = {}) {
  const params = {};

  if (typeof page !== "undefined") params.page = page;
  if (q) params.q = q;
  if (from && to) {
    params.from = from;
    params.to = to;
  }
  if (typeof min === "number") params.min = min;
  if (typeof max === "number") params.max = max;
  if (periode_id) params.periode_id = periode_id;
  if (rt && rt !== "all") params.rt = rt;

  const [json, periodesRaw] = await Promise.all([
    proxyJSON("/arisan/rekap", { params }),
    getPeriodes(),
  ]);

  const dates = Array.isArray(json.dates) ? json.dates : [];

  const paginator =
    json.data && Array.isArray(json.data.data)
      ? json.data
      : { data: Array.isArray(json.data) ? json.data : [] };

  const rawRows = Array.isArray(paginator.data) ? paginator.data : [];

  const filters = json.filters || {};

  const rawPeriodes = Array.isArray(periodesRaw?.data)
    ? periodesRaw.data
    : Array.isArray(periodesRaw)
    ? periodesRaw
    : [];

  const periodes = rawPeriodes.map((p) => {
    const text = p.nama ?? p.name ?? `Tahun ${p.tahun ?? p.year}`;
    return {
      id: p.id,
      nama: text,
      name: text,
      label: text,
      isActive: p.is_active ?? p.isActive ?? false,
      nominal: p.nominal ?? 0,
    };
  });

  const periodeIdFromFilter = filters.periode_id
    ? Number(filters.periode_id)
    : undefined;

  const resolvedPeriodeId =
    periode_id ??
    periodeIdFromFilter ??
    rawPeriodes.find((p) => p.is_active)?.id ??
    null;

  let nominal = Number(json.nominal_arisan ?? 0);

  if (!nominal && resolvedPeriodeId) {
    const p = rawPeriodes.find((pp) => pp.id === resolvedPeriodeId);
    if (p && p.nominal != null) {
      nominal = Number(p.nominal);
    }
  }

  const rows = rawRows.map((row) => {
    const payments = row.payment_status || {};
    const kehadiran = {};
    let jumlahSetoran = 0;
    let totalSetoran = 0;

    for (const d of dates) {
      const info = payments[d];
      if (info?.status === "sudah_bayar") {
        kehadiran[d] = true;
        jumlahSetoran += 1;

        const jml = Number(info.jumlah ?? 0);
        const add = jml > 0 ? jml : nominal || 0;
        totalSetoran += add;
      }
    }

    if (!totalSetoran && row.total_setoran != null) {
      totalSetoran = Number(row.total_setoran) || 0;
    }

    return {
      id: row.warga_id ?? row.id,
      nama: row.nama,
      rt: row.rt,
      status:
        row.status_arisan === "sudah_dapat" ? "Sudah Dapat" : "Belum Dapat",
      jumlahSetoran,
      totalSetoran,
      totalSetoranFormatted: toRp(totalSetoran),
      kehadiran,
    };
  });

  const yearFromPeriodeString =
    Number((json.periode || "").match(/\d{4}/)?.[0]) ||
    new Date().getFullYear();

  const year = filters.year ? Number(filters.year) : yearFromPeriodeString;

  return {
    rows,
    dates,
    page: paginator.current_page ?? 1,
    perPage: paginator.per_page ?? 10,
    total: paginator.total ?? rows.length,
    filters,
    periodes,
    periodeId: resolvedPeriodeId,
    meta: {
      year,
      periodeId: resolvedPeriodeId,
      nominal,
      nominalPerEventFormatted: nominal ? toRp(nominal) : "Rp 0",
    },
    kpi: {
      pemasukanFormatted: "Rp 0",
      pengeluaranFormatted: "Rp 0",
      saldoFormatted: "Rp 0",
      rangeLabel: json.periode || "Rentang mengikuti periode",
    },
  };
}

export async function saveArisanRekap({ periode_id, updates }) {
  return proxyJSON("/arisan/rekap/save", {
    method: "POST",
    json: { periode_id, updates },
    auth: true,
  });
}

export async function getSpinCandidates({ periode_id } = {}) {
  const params = {};
  if (periode_id) params.periode_id = periode_id;

  const json = await proxyJSON("/arisan/spin/candidates", {
    params,
    auth: true,
  });

  const data = Array.isArray(json.data) ? json.data : [];

  return data.map((item, idx) => ({
    id: item.id,
    label: item.nama,
    color: SPIN_COLORS[idx % SPIN_COLORS.length],
    // field lain kalau mau:
    tipe_warga: item.tipe_warga,
    status_arisan: item.status_arisan,
  }));
}

export async function postSpinDraw({ periode_id, warga_id }) {
  const json = await proxyJSON("/arisan/spin/draw", {
    method: "POST",
    json: { periode_id, warga_id },
    auth: true,
  });

  return json;
}
