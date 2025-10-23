"use client";
import * as React from "react";
import { Slider } from "@/components/Slider";
import { X, Undo2 } from "lucide-react";

export default function FilterModal({ open, onClose, onApply, value, bounds }) {
  const [typeIn, setTypeIn] = React.useState(!!value.typeIn);
  const [typeOut, setTypeOut] = React.useState(!!value.typeOut);
  const [range, setRange] = React.useState([
    Number.isFinite(value.min) ? value.min : bounds.min,
    Number.isFinite(value.max) ? value.max : bounds.max,
  ]);

  React.useEffect(() => {
    if (!open) return;
    setTypeIn(!!value.typeIn);
    setTypeOut(!!value.typeOut);
    setRange([
      Number.isFinite(value.min) ? value.min : bounds.min,
      Number.isFinite(value.max) ? value.max : bounds.max,
    ]);
  }, [open]); 

  if (!open) return null;

  const resetAll = () => {
    setTypeIn(false);
    setTypeOut(false);
    setRange([bounds.min, bounds.max]);
  };

  const apply = () => {
    let type = "";
    if (typeIn && !typeOut) type = "IN";
    if (!typeIn && typeOut) type = "OUT";
    onApply({ type, min: range[0], max: range[1] });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-[101] w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Filter</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-[#6E8649] hover:bg-[#EEF0E8]"
              title="Reset all"
            >
              <Undo2 size={16} />
              Reset all
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 hover:bg-gray-100"
              aria-label="Tutup"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <section>
            <div className="mb-2 text-sm font-medium text-gray-600">
              Jenis Transaksi
            </div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={typeIn}
                onChange={(e) => setTypeIn(e.target.checked)}
              />
              <span>Pemasukan</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={typeOut}
                onChange={(e) => setTypeOut(e.target.checked)}
              />
              <span>Pengeluaran</span>
            </label>
            <p className="mt-1 text-xs text-gray-500">
              Centang salah satu untuk memfilter tipe; kosongkan keduanya untuk
              semua.
            </p>
          </section>

          <section>
            <div className="mb-2 text-sm font-medium text-gray-600">
              Nominal
            </div>
            <div className="mb-3 grid grid-cols-2 gap-2">
              <NumberBox
                label="Min"
                value={range[0]}
                onChange={(v) =>
                  setRange([clamp(v, bounds.min, range[1]), range[1]])
                }
              />
              <NumberBox
                label="Max"
                value={range[1]}
                onChange={(v) =>
                  setRange([range[0], clamp(v, range[0], bounds.max)])
                }
              />
            </div>
            <Slider
              value={range}
              min={bounds.min}
              max={bounds.max}
              step={10000}
              onValueChange={setRange}
              className="w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>{fmt(bounds.min)}</span>
              <span>{fmt(bounds.max)}</span>
            </div>
          </section>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-3 py-2 text-sm"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={apply}
            className="rounded-md bg-[#6E8649] px-3 py-2 text-sm text-white"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}

function NumberBox({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2 rounded-md border px-3 py-2">
      <span className="text-xs text-gray-500">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-transparent text-sm outline-none"
      />
    </label>
  );
}
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const fmt = (n) =>
  n.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
