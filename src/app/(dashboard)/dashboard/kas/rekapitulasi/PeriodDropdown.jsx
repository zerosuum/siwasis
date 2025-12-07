"use client";

import * as React from "react";
import { ChevronDown, Plus as IconPlus, Pencil, Trash2 } from "lucide-react";

export default function PeriodDropdown({
  activeId,
  options,
  onSelect,
  onNew,
  onEdit,
  onDelete,
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
          className="absolute right-0 z-50 mt-1 w-[280px] rounded-xl border border-[#E2E7D7] bg-white p-1.5 shadow-xl"
        >
          {Array.isArray(options) && options.length > 0 ? (
            options.map((p) => (
              <div
                key={p.id}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                  p.id === active?.id
                    ? "font-semibold text-[#6E8649] bg-[#F4F6EE]"
                    : "text-gray-700 hover:bg-[#F4F6EE]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelect?.(p.id);
                    setOpen(false);
                  }}
                  className="flex-1 text-left"
                >
                  {p.nama}
                </button>

                <div className="ml-2 flex items-center gap-1">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => {
                        onEdit(p);
                        setOpen(false);
                      }}
                      className="p-1 rounded-md hover:bg-gray-100"
                      title="Edit periode"
                    >
                      <Pencil size={14} className="text-gray-500" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(p);
                        
                      }}
                      className="p-1 rounded-md hover:bg-gray-100"
                      title="Hapus periode"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  )}
                </div>
              </div>
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