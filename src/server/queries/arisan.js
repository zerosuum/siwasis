import { proxyJSON } from "./_api";
import { toRp } from "@/lib/format";
import { getPeriodes } from "./periode";

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
  const params = { page, q, from, to, min, max, periode_id };
  if (rt && rt !== "all") {
    params.rt = rt;
  }

  const [json, periodesRaw] = await Promise.all([
    proxyJSON("/arisan/rekap", { params }),
    getPeriodes(),
  ]);

  const dates = Array.isArray(json.dates) ? json.dates : [];

  const paginator = json.data || {};
  const rawRows = Array.isArray(paginator.data) ? paginator.data : [];

  const rows = rawRows.map((row) => {
    const total = Number(row.total_setoran ?? 0);

    const kehadiran = {};
    for (const d of dates) {
      const info = row.payment_status?.[d];
      if (info?.status === "sudah_bayar") {
        kehadiran[d] = true;
      }
    }

    return {
      id: row.warga_id,
      nama: row.nama,
      rt: row.rt,
      status:
        row.status_arisan === "sudah_dapat" ? "Sudah Dapat" : "Belum Dapat",
      jumlahSetoran: total,
      totalSetoranFormatted: toRp(total),
      kehadiran,
    };
  });

  const filters = json.filters || {};

  const rawPeriodes = Array.isArray(periodesRaw?.data)
    ? periodesRaw.data
    : Array.isArray(periodesRaw)
    ? periodesRaw
    : [];

  const periodes = rawPeriodes.map((p) => ({
    id: p.id,
    label: p.nama ?? p.name ?? `Tahun ${p.tahun ?? p.year}`,
    isActive: p.is_active ?? p.isActive ?? false,
  }));

  const periodeIdFromFilter = filters.periode_id
    ? Number(filters.periode_id)
    : undefined;

  const periodeId =
    periode_id ??
    periodeIdFromFilter ??
    rawPeriodes.find((p) => p.is_active)?.id ??
    null;

  const nominal = Number(json.nominal_arisan ?? 0);

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
    periodeId,
    meta: {
      year,
      periodeId,
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
  const json = await proxyJSON("/arisan/spin/candidates", {
    params: { periode_id },
    auth: true,
  });

  const items = Array.isArray(json.data) ? json.data : [];

  const palette = [
    "#6E8649",
    "#B0892E",
    "#4C6FFF",
    "#E56B6F",
    "#38A3A5",
    "#FFB703",
    "#E07A5F",
    "#3A6EA5",
  ];

  return items.map((item, idx) => ({
    id: item.id,
    label: item.nama,
    color: palette[idx % palette.length],
  }));
}

export async function postSpinDraw({ periode_id, warga_id }) {
  return proxyJSON("/arisan/spin/draw", {
    method: "POST",
    json: { periode_id, warga_id },
    auth: true,
  });
}
