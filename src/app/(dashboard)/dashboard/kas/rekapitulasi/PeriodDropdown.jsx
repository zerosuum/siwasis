"use client";

import * as React from "react";
import { ChevronDown, Plus as IconPlus } from "lucide-react";

export default function PeriodDropdown({
  activeId,
  options,
  onSelect,
  onNew,
  showCreateButton,
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const onClickOutside = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const active = React.useMemo(() => {
    if (!Array.isArray(options)) return null;
    return options.find((p) => p.id === activeId) || options[0] || null;
  }, [options, activeId]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-9 w-[220px] rounded-[12px] border border-[#E2E7D7] bg-white px-3 text-sm flex items-center justify-between"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{active ? active.nama : "Pilih periode"}</span>
        <ChevronDown size={16} className="opacity-70" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-50 mt-1 w-[260px] rounded-xl border border-[#E2E7D7] bg-white p-1.5 shadow-xl"
        >
          {Array.isArray(options) && options.length > 0 ? (
            options.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelect?.(p.id);
                  setOpen(false);
                }}
                className={`w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-[#F4F6EE] ${
                  p.id === active?.id
                    ? "font-semibold text-[#6E8649]"
                    : "text-gray-700"
                }`}
              >
                {p.nama}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              Belum ada periode.
            </div>
          )}

          {showCreateButton && (
            <>
              <div className="my-1 h-px bg-gray-100" />
              <button
                onClick={() => {
                  setOpen(false);
                  onNew?.();
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-[#EEF0E8]"
              >
                <span>Periode baru</span>
                <IconPlus size={16} className="opacity-70" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
