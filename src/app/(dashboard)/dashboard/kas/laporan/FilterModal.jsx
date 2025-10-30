"use client";
import * as React from "react";

const RT_OPTIONS = [
  "all",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
];

// dual-range slider helper
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function FilterModal({ open, onClose, value = {}, onApply }) {
  if (!open) return null;

  // state awal dari value
  const [rt, setRt] = React.useState(value.rt ?? "all");
  const [role, setRole] = React.useState(value.role ?? "");
  const [kasOnly, setKasOnly] = React.useState(!!value.kasOnly);
  const [arisanOnly, setArisanOnly] = React.useState(!!value.arisanOnly);

  // angka dalam rupiah
  const MAX = 10_000_000;
  const STEP = 5_000;

  const [kasMin, setKasMin] = React.useState(Number(value.kasMin ?? 0));
  const [kasMax, setKasMax] = React.useState(Number(value.kasMax ?? MAX));
  const [ariMin, setAriMin] = React.useState(Number(value.ariMin ?? 0));
  const [ariMax, setAriMax] = React.useState(Number(value.ariMax ?? MAX));

  // jaga thumbs tidak saling silang
  const setKasMinSafe = (v) => setKasMin(clamp(v, 0, kasMax));
  const setKasMaxSafe = (v) => setKasMax(clamp(v, kasMin, MAX));
  const setAriMinSafe = (v) => setAriMin(clamp(v, 0, ariMax));
  const setAriMaxSafe = (v) => setAriMax(clamp(v, ariMin, MAX));

  const fmt = (n) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(n || 0));

  const resetAll = () => {
    setRt("all");
    setRole("");
    setKasOnly(false);
    setArisanOnly(false);
    setKasMin(0);
    setKasMax(MAX);
    setAriMin(0);
    setAriMax(MAX);
  };

  const apply = () => {
    onApply?.({
      rt,
      role,
      kasOnly,
      arisanOnly,
      kas_min: kasMin > 0 ? kasMin : "",
      kas_max: kasMax < MAX ? kasMax : "",
      arisan_min: ariMin > 0 ? ariMin : "",
      arisan_max: ariMax < MAX ? ariMax : "",
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[520px] max-w-[95vw] rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filter</h3>
          <button
            onClick={resetAll}
            className="text-sm text-[#6E8649] hover:underline"
          >
            Reset all
          </button>
        </div>

        {/* Status arisan (opsional—biar mirip mock). Kamu boleh hide jika bukan konteksnya */}
        <div className="mb-4">
          <div className="mb-2 text-sm font-medium text-gray-700">
            Status Arisan
          </div>
          <label className="mr-4 inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={arisanOnly}
              onChange={(e) => setArisanOnly(e.target.checked)}
            />
            Sudah dapat / anggota arisan
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={kasOnly}
              onChange={(e) => setKasOnly(e.target.checked)}
            />
            Anggota kas
          </label>
        </div>

        {/* RT chips */}
        <div className="mb-4">
          <div className="mb-2 text-sm font-medium text-gray-700">RT</div>
          <div className="flex flex-wrap gap-2">
            {RT_OPTIONS.map((code) => {
              const active = rt === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setRt(code)}
                  className={`rounded-full px-4 py-1.5 text-sm border transition
                    ${
                      active
                        ? "bg-[#6E8649] text-white border-[#6E8649]"
                        : "bg-[#F5F7EF] text-gray-700 border-[#E2E7D7] hover:bg-[#EEF2E6]"
                    }`}
                >
                  {code === "all" ? "Semua" : code}
                </button>
              );
            })}
          </div>
        </div>

        {/* Kas range */}
        <div className="mb-5">
          <div className="mb-2 text-sm font-medium text-gray-700">
            Jumlah Setoran Kas
          </div>
          <div className="grid grid-cols-2 gap-3 mb-2">
            <input
              inputMode="numeric"
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              placeholder="Min"
              value={kasMin}
              onChange={(e) => setKasMinSafe(Number(e.target.value || 0))}
            />
            <input
              inputMode="numeric"
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              placeholder="Max"
              value={kasMax}
              onChange={(e) => setKasMaxSafe(Number(e.target.value || 0))}
            />
          </div>

          <div className="relative h-8">
            {/* track */}
            <div className="absolute left-0 right-0 top-3 h-1 rounded bg-[#E2E7D7]" />
            {/* range highlight */}
            <div
              className="absolute top-3 h-1 rounded bg-[#6E8649]"
              style={{
                left: `${(kasMin / MAX) * 100}%`,
                right: `${100 - (kasMax / MAX) * 100}%`,
              }}
            />
            {/* 2 thumbs (dua input range) */}
            <input
              type="range"
              min={0}
              max={MAX}
              step={STEP}
              value={kasMin}
              onChange={(e) => setKasMinSafe(Number(e.target.value))}
              className="absolute left-0 right-0 w-full appearance-none bg-transparent pointer-events-auto"
            />
            <input
              type="range"
              min={0}
              max={MAX}
              step={STEP}
              value={kasMax}
              onChange={(e) => setKasMaxSafe(Number(e.target.value))}
              className="absolute left-0 right-0 w-full appearance-none bg-transparent pointer-events-auto"
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>{fmt(0)}</span>
            <span>{fmt(MAX)}</span>
          </div>
        </div>

        {/* Arisan range */}
        <div className="mb-6">
          <div className="mb-2 text-sm font-medium text-gray-700">
            Jumlah Setoran Arisan
          </div>
          <div className="grid grid-cols-2 gap-3 mb-2">
            <input
              inputMode="numeric"
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              placeholder="Min"
              value={ariMin}
              onChange={(e) => setAriMinSafe(Number(e.target.value || 0))}
            />
            <input
              inputMode="numeric"
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              placeholder="Max"
              value={ariMax}
              onChange={(e) => setAriMaxSafe(Number(e.target.value || 0))}
            />
          </div>

          <div className="relative h-8">
            <div className="absolute left-0 right-0 top-3 h-1 rounded bg-[#E2E7D7]" />
            <div
              className="absolute top-3 h-1 rounded bg-[#6E8649]"
              style={{
                left: `${(ariMin / MAX) * 100}%`,
                right: `${100 - (ariMax / MAX) * 100}%`,
              }}
            />
            <input
              type="range"
              min={0}
              max={MAX}
              step={STEP}
              value={ariMin}
              onChange={(e) => setAriMinSafe(Number(e.target.value))}
              className="absolute left-0 right-0 w-full appearance-none bg-transparent"
            />
            <input
              type="range"
              min={0}
              max={MAX}
              step={STEP}
              value={ariMax}
              onChange={(e) => setAriMaxSafe(Number(e.target.value))}
              className="absolute left-0 right-0 w-full appearance-none bg-transparent"
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>{fmt(0)}</span>
            <span>{fmt(MAX)}</span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-4 py-1.5 text-sm"
          >
            Batal
          </button>
          <button
            onClick={apply}
            className="rounded-lg bg-[#6E8649] px-4 py-1.5 text-sm text-white"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}
