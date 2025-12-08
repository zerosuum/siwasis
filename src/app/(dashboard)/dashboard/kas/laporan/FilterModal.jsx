"use client";

import * as React from "react";
import { Slider } from "@/components/Slider";
import { X, Undo2 } from "lucide-react";

export default function FilterModal({
  open,
  onClose,
  onApply,
  value,
  bounds,
  anchorEl,
  align = "left",
  offset = 8,
}) {
  // "all" | "IN" | "OUT"
  const [type, setType] = React.useState(
    value.typeIn ? "IN" : value.typeOut ? "OUT" : "all"
  );

  const [range, setRange] = React.useState([
    Number.isFinite(value.min) ? value.min : bounds.min,
    Number.isFinite(value.max) ? value.max : bounds.max,
  ]);

  React.useEffect(() => {
    setType(value.typeIn ? "IN" : value.typeOut ? "OUT" : "all");
    setRange([
      Number.isFinite(value.min) ? value.min : bounds.min,
      Number.isFinite(value.max) ? value.max : bounds.max,
    ]);
  }, [open, value, bounds]);

  const resetAll = () => {
    setType("all");
    setRange([bounds.min, bounds.max]);

    onApply?.({
      type: "",
      min: undefined,
      max: undefined,
    });
    onClose?.();
  };

  const apply = () => {
    const mappedType = type === "IN" || type === "OUT" ? type : "";
    const [minVal, maxVal] = range;

    const isFullRange = minVal === bounds.min && maxVal === bounds.max;

    onApply({
      type: mappedType,
      min: isFullRange ? undefined : minVal,
      max: isFullRange ? undefined : maxVal,
    });

    onClose?.();
  };
  const panelRef = React.useRef(null);
  const [pos, setPos] = React.useState({ top: 0, left: 0, ready: false });

  React.useLayoutEffect(() => {
    if (!open || !anchorEl) return;

    const calc = () => {
      const r = anchorEl.getBoundingClientRect();
      const pw = panelRef.current?.offsetWidth ?? 480;
      const vw = window.innerWidth;

      let left = align === "right" ? r.right - pw : r.left;
      left = Math.min(Math.max(12, left), vw - pw - 12);

      const top = Math.max(12, r.bottom + offset);

      setPos({ top, left, ready: true });
    };

    calc();

    const onScroll = () => calc();
    window.addEventListener("resize", calc);
    window.addEventListener("scroll", onScroll, true);

    return () => {
      window.removeEventListener("resize", calc);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, anchorEl, align, offset]);

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  if (!open) return null;

  return (
    <>
      {/* backdrop full-screen */}
      <div className="fixed inset-0 z-[100]" onMouseDown={onBackdrop} />

      {/* panel anchored di bawah icon */}
      <div
        ref={panelRef}
        className="fixed z-[101] w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl border border-[#EEF0E8]"
        style={{
          top: pos.top,
          left: pos.left,
          visibility: pos.ready ? "visible" : "hidden",
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* HEADER */}
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

        {/* TIPE TRANSAKSI */}
        <div className="mb-3">
          <div className="mb-2 text-sm font-medium text-gray-600">
            Tipe transaksi
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip selected={type === "all"} onClick={() => setType("all")}>
              Semua
            </Chip>
            <Chip selected={type === "IN"} onClick={() => setType("IN")}>
              Pemasukan
            </Chip>
            <Chip selected={type === "OUT"} onClick={() => setType("OUT")}>
              Pengeluaran
            </Chip>
          </div>
        </div>

        {/* NOMINAL */}
        <div className="mt-4">
          <div className="mb-2 text-sm font-medium text-gray-600">
            Nominal transaksi
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2">
            <NumberBox label="Min" value={range[0]} />
            <NumberBox label="Max" value={range[1]} />
          </div>

          <Slider
            value={range}
            min={bounds.min}
            max={bounds.max}
            step={10000}
            onValueChange={(val) => setRange(val)}
            ariaLabelThumb="Nominal Transaksi"
            className="w-full"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>{fmt(bounds.min)}</span>
            <span>{fmt(bounds.max)}</span>
          </div>
        </div>

        {/* ACTIONS */}
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
    </>
  );
}

function Chip({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-3 py-1 text-sm transition",
        selected
          ? "bg-[#EEF0E8] text-[#6E8649] ring-1 ring-[#6E8649]/30"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function NumberBox({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 cursor-default select-none">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{fmt(value)}</span>
    </div>
  );
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const fmt = (n) =>
  n.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
