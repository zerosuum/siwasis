"use client";

import * as React from "react";
import { Slider } from "@/components/Slider";
import { X, Undo2 } from "lucide-react";

function Chip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-3 py-1 text-xs sm:text-sm transition",
        active
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
  Number(n || 0).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

export default function FilterModal({
  open,
  onClose,
  anchorEl,
  value = {},
  onApply,
  align = "right",
  offset = 8,
  rtOptions = [],
  bounds = { min: 0, max: 10_000_000 },
}) {
  const [rt, setRt] = React.useState(value.rt ?? "all");

  const [range, setRange] = React.useState(() => {
    const minVal = Number.isFinite(value.min)
      ? clamp(value.min, bounds.min, bounds.max)
      : bounds.min;
    const maxVal = Number.isFinite(value.max)
      ? clamp(value.max, minVal, bounds.max)
      : bounds.max;
    return [minVal, maxVal];
  });

  const [statusSudah, setStatusSudah] = React.useState(
    value.status === "sudah_dapat"
  );
  const [statusBelum, setStatusBelum] = React.useState(
    value.status === "belum_dapat"
  );

  React.useEffect(() => {
    if (!open) return;

    setRt(value.rt ?? "all");

    const minVal = Number.isFinite(value.min)
      ? clamp(value.min, bounds.min, bounds.max)
      : bounds.min;
    const maxVal = Number.isFinite(value.max)
      ? clamp(value.max, minVal, bounds.max)
      : bounds.max;

    setRange([minVal, maxVal]);
    setStatusSudah(value.status === "sudah_dapat");
    setStatusBelum(value.status === "belum_dapat");
  }, [open, value, bounds]);

  const panelRef = React.useRef(null);
  const [pos, setPos] = React.useState({ top: 0, left: 0, ready: false });

  React.useLayoutEffect(() => {
    if (!open || !anchorEl) return;

    const calc = () => {
      const r = anchorEl.getBoundingClientRect();
      const pw = panelRef.current?.offsetWidth ?? 420;
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

  if (!open) return null;

  const chosenStatus =
    statusSudah === statusBelum
      ? ""
      : statusSudah
      ? "sudah_dapat"
      : "belum_dapat";

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const handleApply = () => {
    onApply?.({
      rt: rt === "all" ? undefined : rt,
      min: range[0],
      max: range[1],
      status: chosenStatus || undefined,
    });
    onClose?.();
  };

  const handleReset = () => {
    setRt("all");
    setRange([bounds.min, bounds.max]);
    setStatusSudah(false);
    setStatusBelum(false);

    onApply?.({
      rt: undefined,
      min: undefined,
      max: undefined,
      status: undefined,
    });

    onClose?.();
  };

  return (
    <>
      <div className="fixed inset-0 z-[199]" onMouseDown={onBackdrop} />
      <div
        ref={panelRef}
        className="fixed z-[200] w-[420px] max-w-[95vw] rounded-2xl border border-[#EEF0E8] bg-white p-6 shadow-xl"
        style={{
          top: pos.top,
          left: pos.left,
          visibility: pos.ready ? "visible" : "hidden",
        }}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            Filter
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs sm:text-sm text-[#6E8649] hover:bg-[#EEF0E8]"
              title="Reset all"
            >
              <Undo2 size={16} />
              <span>Reset all</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 hover:bg-gray-100"
              aria-label="Tutup"
              title="Tutup"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <div className="mb-2 text-sm font-medium text-[#8B8FA1]">
              Status Arisan
            </div>
            <label className="mb-1 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={statusSudah}
                onChange={(e) => setStatusSudah(e.target.checked)}
              />
              <span>Sudah Dapat</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={statusBelum}
                onChange={(e) => setStatusBelum(e.target.checked)}
              />
              <span>Belum Dapat</span>
            </label>
            <p className="mt-1 text-[11px] text-gray-400">
              Kalau dua-duanya dicentang / dua-duanya kosong → dianggap Semua.
            </p>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-[#8B8FA1]">RT</div>
            <div className="flex flex-wrap gap-2">
              <Chip
                active={(rt || "all") === "all"}
                onClick={() => setRt("all")}
              >
                Semua
              </Chip>
              {rtOptions.map((opt) => (
                <Chip
                  key={opt.value}
                  active={rt === opt.value}
                  onClick={() => setRt(opt.value)}
                >
                  {opt.label}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-[#8B8FA1]">
              Total Setoran Arisan
            </div>

            <div className="mb-3 grid grid-cols-2 gap-3">
              <NumberBox label="Min" value={range[0]} />
              <NumberBox label="Max" value={range[1]} />
            </div>

            <Slider
              value={range}
              min={bounds.min}
              max={bounds.max}
              step={10000}
              onValueChange={(val) => setRange(val)}
              ariaLabelThumb="Jumlah Setoran"
              className="w-full"
            />

            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>{fmt(bounds.min)}</span>
              <span>{fmt(bounds.max)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-lg bg-[#6E8649] px-4 py-2 text-sm text-white"
          >
            Terapkan
          </button>
        </div>
      </div>
    </>
  );
}
