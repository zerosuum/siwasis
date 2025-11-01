"use client";

import * as React from "react";
import { Plus as IconPlus, ChevronDown } from "lucide-react";

export default function PeriodDropdown({
  year,
  onSelectYear,
  onNew,
  isLoggedIn,
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

  const years = React.useMemo(() => {
    const now = new Date().getFullYear();
    return Array.from({ length: 6 }).map((_, i) => now - i);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-8 w-[180px] rounded-[12px] border border-[#E2E7D7] bg-white px-3 text-sm flex items-center justify-between"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{`Periode ${year}`}</span>
        <ChevronDown size={16} className="opacity-70" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-50 mt-1 w-[220px] rounded-xl border bg-white p-1.5 shadow-xl"
        >
          {years.map((y) => (
            <button
              key={y}
              onClick={() => {
                onSelectYear?.(y);
                setOpen(false);
              }}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-[#F4F6EE] ${
                y === year ? "font-semibold text-[#6E8649]" : "text-gray-700"
              }`}
            >
              {`Periode ${y}`}
            </button>
          ))}

          {isLoggedIn && (
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
