"use client";
import * as React from "react";

export default function GenericFilterModal({
  open,
  onClose,
  value = {},
  onApply,
  anchorEl,
  align = "left", 
  offset = 8,
}) {
  const [typeIn, setTypeIn] = React.useState(!!value.typeIn);
  const [typeOut, setTypeOut] = React.useState(!!value.typeOut);
  const [min, setMin] = React.useState(value.min || "");
  const [max, setMax] = React.useState(value.max || "");

  React.useEffect(() => {
    if (open) {
      setTypeIn(!!value.typeIn);
      setTypeOut(!!value.typeOut);
      setMin(value.min || "");
      setMax(value.max || "");
    }
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

  const resetAll = () => {
    setTypeIn(false);
    setTypeOut(false);
    setMin("");
    setMax("");
  };

  const apply = () => {
    let type = undefined;
    if (typeIn && !typeOut) type = "IN";
    if (!typeIn && typeOut) type = "OUT";

    onApply?.({
      type,
      min: min || undefined,
      max: max || undefined,
    });
    onClose?.();
  };

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[199]" onMouseDown={onBackdrop} />

      <div
        ref={panelRef}
        className="fixed z-[200] w-[420px] max-w-[95vw] rounded-2xl bg-white p-6 shadow-xl border border-[#EEF0E8]"
        style={{
          top: pos.top,
          left: pos.left,
          visibility: pos.ready ? "visible" : "hidden",
        }}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filter Laporan</h3>
          <button
            onClick={resetAll}
            className="text-sm text-[#6E8649] hover:underline"
          >
            Reset all
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tipe Transaksi
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={typeIn}
                  onChange={(e) => setTypeIn(e.target.checked)}
                />
                Pemasukan
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={typeOut}
                  onChange={(e) => setTypeOut(e.target.checked)}
                />
                Pengeluaran
              </label>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nominal
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                inputMode="numeric"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                placeholder="Minimum (Rp)"
                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              />
              <input
                type="number"
                inputMode="numeric"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                placeholder="Maksimum (Rp)"
                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
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
    </>
  );
}
