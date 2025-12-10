"use client";
import * as React from "react";
import { Slider } from "@/components/Slider";

function Chip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`h-10 rounded-full px-4 text-sm transition-colors ${
        active ? "bg-[#E6EBDE] text-[#46552D]" : "bg-gray-100 text-gray-700"
      }`}
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
  onReset,
  align = "left",
  offset = 8,
  rtOptions = ["all", "01", "02", "03", "04", "05", "06", "07", "08", "09"],
}) {
  const [rt, setRt] = React.useState(value.rt ?? "all");
  const [statusSudah, setStatusSudah] = React.useState(
    value.arisan_status === "sudah_dapat"
  );
  const [statusBelum, setStatusBelum] = React.useState(
    value.arisan_status === "belum_dapat"
  );

  const [kasRange, setKasRange] = React.useState(() => {
    const min = value.kas_min ? Number(value.kas_min) : 0;
    const max = value.kas_max ? Number(value.kas_max) : 10_000_000;
    return [min, max];
  });

  const [arRange, setArRange] = React.useState(() => {
    const min = value.arisan_min ? Number(value.arisan_min) : 0;
    const max = value.arisan_max ? Number(value.arisan_max) : 10_000_000;
    return [min, max];
  });

  React.useEffect(() => {
    if (!open) return;
    setRt(value.rt ?? "all");
    setStatusSudah(value.arisan_status === "sudah_dapat");
    setStatusBelum(value.arisan_status === "belum_dapat");

    const kasMin = value.kas_min ? Number(value.kas_min) : 0;
    const kasMax = value.kas_max ? Number(value.kas_max) : 10_000_000;
    setKasRange([kasMin, kasMax]);

    const arMin = value.arisan_min ? Number(value.arisan_min) : 0;
    const arMax = value.arisan_max ? Number(value.arisan_max) : 10_000_000;
    setArRange([arMin, arMax]);
  }, [open, value]);

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
          <h3 className="text-xl font-semibold">Filter</h3>
          <button
            type="button"
            className="text-sm font-medium text-[#6E8649] hover:underline"
            onClick={onReset}
          >
            Reset all
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <div className="mb-2 font-medium text-[#8B8FA1]">Status Arisan</div>
            <label className="mb-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={statusSudah}
                onChange={(e) => setStatusSudah(e.target.checked)}
              />
              <span>Sudah dapat</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={statusBelum}
                onChange={(e) => setStatusBelum(e.target.checked)}
              />
              <span>Belum dapat</span>
            </label>
          </div>

          <div>
            <div className="mb-2 font-medium text-[#8B8FA1]">RT</div>
            <div className="flex flex-wrap gap-3">
              {rtOptions.map((x) => (
                <Chip
                  key={x}
                  active={(rt || "all") === x}
                  onClick={() => setRt(x)}
                >
                  {x === "all" ? "Semua" : x}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 font-medium text-[#8B8FA1]">
              Jumlah Setoran Kas
            </div>

            <div className="mb-3 grid grid-cols-2 gap-3">
              <NumberBox label="Min" value={kasRange[0]} />
              <NumberBox label="Max" value={kasRange[1]} />
            </div>

            <Slider
              value={kasRange}
              min={0}
              max={10_000_000}
              step={10000}
              onValueChange={(val) => setKasRange(val)}
              ariaLabelThumb="Jumlah Setoran Kas"
              className="w-full"
            />

            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>{fmt(0)}</span>
              <span>{fmt(10_000_000)}</span>
            </div>
          </div>

          <div>
            <div className="mb-2 font-medium text-[#8B8FA1]">
              Jumlah Setoran Arisan
            </div>

            <div className="mb-3 grid grid-cols-2 gap-3">
              <NumberBox label="Min" value={arRange[0]} />
              <NumberBox label="Max" value={arRange[1]} />
            </div>

            <Slider
              value={arRange}
              min={0}
              max={10_000_000}
              step={10000}
              onValueChange={(val) => setArRange(val)}
              ariaLabelThumb="Jumlah Setoran Arisan"
              className="w-full"
            />

            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>{fmt(0)}</span>
              <span>{fmt(10_000_000)}</span>
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
            onClick={() =>
              onApply({
                rt,
                arisan_status: chosenStatus || undefined,
                kas_min: kasRange[0],
                kas_max: kasRange[1],
                arisan_min: arRange[0],
                arisan_max: arRange[1],
              })
            }
            className="rounded-lg bg-[#6E8649] px-4 py-2 text-sm text-white"
          >
            Terapkan
          </button>
        </div>
      </div>
    </>
  );
}
