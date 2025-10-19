// src/app/api/mock/kas/route.js
import { DATA } from "./store.mjs";

function clamp(n, lo, hi) {
  const x = Number(n);
  if (!Number.isFinite(x)) return lo;
  return Math.max(lo, Math.min(hi, x));
}

function getMonth(iso) {
  // iso: YYYY-MM-DD
  if (!iso || typeof iso !== "string" || iso.length < 7) return null;
  return Number(iso.slice(5, 7));
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  // pagination (server-side)
  const page = clamp(searchParams.get("page") ?? 1, 1, Number.MAX_SAFE_INTEGER);
  const DEFAULT_LIMIT = 15;
  const MAX_LIMIT = 50; // keras: biar payload kecil
  const limit = clamp(searchParams.get("limit") ?? DEFAULT_LIMIT, 1, MAX_LIMIT);

  // filters
  const monthParam = searchParams.get("month");
  const month = monthParam ? clamp(monthParam, 1, 12) : null;
  const q = (searchParams.get("q") ?? "").toString().trim().toLowerCase();

  // target window (berdasar index hasil-filter)
  const start = (page - 1) * limit;
  const endExclusive = start + limit;

  // single-pass: tanpa bikin array "filtered" penuh
  let total = 0;
  let pemasukan = 0;
  let pengeluaran = 0;
  const rows = [];

  for (let i = 0; i < DATA.length; i++) {
    const r = DATA[i];

    // month filter (opsional)
    if (month && getMonth(r?.tanggal) !== month) continue;

    // text filter (opsional): cek di keterangan / tipe
    const ket = (r?.keterangan ?? "").toString();
    const tipe = (r?.tipe ?? "").toString();
    if (q) {
      const hit =
        ket.toLowerCase().includes(q) || tipe.toLowerCase().includes(q);
      if (!hit) continue;
    }

    // lolos filter
    // summary dihitung global (bukan per halaman)
    const nominal = Number(r?.nominal ?? 0);
    if (tipe === "pemasukan") pemasukan += nominal;
    else if (tipe === "pengeluaran") pengeluaran += nominal;

    // indeks hasil-filter ke- (total) → pakai untuk windowing halaman
    const filteredIndex = total; // sebelum ++
    total += 1;

    if (filteredIndex >= start && filteredIndex < endExclusive) {
      rows.push(r);
      // tidak perlu break; tetap lanjut untuk hitung summary & total
    }
  }

  return Response.json({
    page,
    limit,
    total,
    month: month ?? null,
    summary: {
      pemasukan,
      pengeluaran,
      saldo: pemasukan - pengeluaran,
    },
    rows,
  });
}

export async function POST(req) {
  const body = await req.json();
  const id = DATA.length ? Math.max(...DATA.map((x) => x.id)) + 1 : 1;
  const newItem = {
    id,
    tanggal: body.tanggal,
    keterangan: body.keterangan,
    tipe: body.tipe, // "pemasukan" | "pengeluaran"
    nominal: Number(body.nominal),
  };
  // prepend: item baru tampil di awal
  DATA.unshift(newItem);
  return Response.json(newItem, { status: 201 });
}
