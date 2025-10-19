"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DateRangePicker } from "@/components/DatePicker";
import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation";
import RekapTable from "./RekapTable";
import Pagination from "@/components/Pagination";
import { useToast } from "@/components/ui/useToast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import FilterModal from "./FilterModal";
import { actionSaveRekap } from "./actions";
import {
  Calendar as IconCalendar,
  Search as IconSearch,
  SlidersHorizontal as IconFilter,
  Download as IconDownload,
  Pencil as IconPencil,
} from "lucide-react";
import { API_BASE } from "@/lib/config";

export default function RekapClient({ initial }) {
  const router = useRouter();
  const sp = useSearchParams();
  const { show } = useToast();

  // URL state
  const page = initial?.page || 1;
  const year = initial?.meta?.year || new Date().getFullYear();
  const q = sp.get("q") || "";
  const rt = sp.get("rt") || "all";
  const from = sp.get("from");
  const to = sp.get("to");

  // UI state
  const [searchQuery, setSearchQuery] = React.useState(q);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);

  // Edit state
  const [editing, setEditing] = React.useState(false);
  const [updates, setUpdates] = React.useState([]);
  const [confirmSave, setConfirmSave] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const [confirmDownload, setConfirmDownload] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);

  // Range tanggal
  const initRange =
    sp.get("from") && sp.get("to")
      ? { from: new Date(sp.get("from")), to: new Date(sp.get("to")) }
      : undefined;
  const [range, setRange] = React.useState(initRange);

  // Buka DateRangePicker hidden
  const filterAnchorRef = React.useRef(null);
  const openFilterCalendar = React.useCallback(() => {
    if (!filterAnchorRef.current) return;
    const root = filterAnchorRef.current;
    const trigger =
      root.querySelector('button[aria-haspopup="dialog"]') ||
      root.querySelector('button[type="button"]') ||
      root.querySelector("button");
    if (!trigger) return;
    ["pointerdown", "mousedown", "mouseup", "click"].forEach((type) => {
      trigger.dispatchEvent(
        new MouseEvent(type, { bubbles: true, cancelable: true, view: window })
      );
    });
  }, []);

  // Apply range (preserve rt/q, reset page)
React.useEffect(() => {
  if (!range?.from || !range?.to) return;

  const params = new URLSearchParams(sp.toString());
  // preserve yang sudah ada
  if (sp.get("rt")) params.set("rt", sp.get("rt"));
  if (sp.get("q")) params.set("q", sp.get("q"));

  // set range baru + year sekarang
  params.set("year", String(year));
  params.set("from", range.from.toISOString().slice(0, 10));
  params.set("to", range.to.toISOString().slice(0, 10));

  // reset page biar server fetch page 1 dgn header baru
  params.set("page", "1");

  router.push(`/dashboard/kas/rekapitulasi?${params.toString()}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [range?.from, range?.to]);

  // Navigate helper (preserve param lain)
  const navigate = (newParams) => {
    const params = new URLSearchParams(sp.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
      else params.delete(k);
    });
    if (!newParams.page) params.set("page", "1");
    router.push(`/dashboard/kas/rekapitulasi?${params.toString()}`);
  };

  // Toggle checkbox
  const onToggle = React.useCallback((wargaId, tanggal, checked) => {
    setUpdates((prev) => {
      const key = `${wargaId}-${tanggal}`;
      const next = prev.filter((u) => `${u.wargaId}-${u.tanggal}` !== key);
      next.push({ wargaId, tanggal, checked });
      return next;
    });
  }, []);

  // Save
  const onSave = async () => {
    setConfirmSave(false);
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("payload", JSON.stringify({ year, updates, from, to }));
        await actionSaveRekap(fd);

        setEditing(false);
        setUpdates([]);
        setSuccessOpen(true);

        // force refresh URL sekarang (preserve semua param)
        router.replace(`/dashboard/kas/rekapitulasi?${sp.toString()}`);
        router.refresh();
      } catch (e) {
        show({
          title: "Gagal",
          description: "Gagal menyimpan perubahan.",
          variant: "error",
        });
      }
    });
  };

  // Lock sidebar saat editing
  React.useEffect(() => {
    const aside = document.querySelector("aside");
    if (editing) {
      aside?.classList.add("pointer-events-none", "opacity-60");
    } else {
      aside?.classList.remove("pointer-events-none", "opacity-60");
    }
    return () => {
      aside?.classList.remove("pointer-events-none", "opacity-60");
    };
  }, [editing]);

  // Peringatan close tab ketika editing
  React.useEffect(() => {
    const onBeforeUnload = (e) => {
      if (!editing) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [editing]);

  // Data untuk modal
  const rtOptions = React.useMemo(() => ["01", "02", "03", "04", "05"], []);
  const setoranBounds = React.useMemo(() => ({ min: 0, max: 100000 }), []);

  return (
    <>
      <div className="flex items-center justify-between gap-3 px-4 pt-0 border-[#E2E7D7]">
        <TabNavigation className="h-6 leading-none">
          <TabNavigationLink
            href="/dashboard/kas/rekapitulasi"
            active
            className="inline-flex h-6 items-center border-b-2 !border-[#6E8649] px-2 text-sm font-medium !text-[#6E8649]"
          >
            Rekapitulasi Pembayaran
          </TabNavigationLink>
          <TabNavigationLink
            href="/dashboard/kas/laporan"
            className="inline-flex h-6 items-center px-2 text-sm font-medium text-gray-400 hover:text-gray-600"
          >
            Laporan Keuangan
          </TabNavigationLink>
        </TabNavigation>

        <div className="flex items-center gap-2">
          <select
            className="h-8 w-[180px] rounded-[12px] border border-[#E2E7D7] bg-white px-3 text-sm"
            value={year}
            onChange={(e) => navigate({ year: e.target.value })}
          >
            {Array.from({ length: 6 }).map((_, i) => {
              const y = new Date().getFullYear() - i;
              return (
                <option key={y} value={y}>
                  Periode {y}
                </option>
              );
            })}
          </select>

          <div
            className="relative"
            onMouseEnter={() => setSearchOpen(true)}
            onMouseLeave={() => (searchQuery ? null : setSearchOpen(false))}
          >
            <IconSearch
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate({ q: searchQuery })
              }
              placeholder="Pencarian..."
              className={`h-8 rounded-[12px] border border-[#E2E7D7] bg-white pl-8 pr-3 text-sm ${
                searchOpen || searchQuery ? "w-56" : "w-10"
              }`}
            />
          </div>

          <button
            onClick={() => setFilterOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#E2E7D7] bg-white"
          >
            <IconFilter size={16} />
          </button>

          {/* Trigger DateRangePicker yang disembunyikan */}
          <button
            type="button"
            onClick={openFilterCalendar}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#E2E7D7] bg-white"
            title="Pilih rentang tanggal"
            aria-label="Pilih rentang tanggal"
          >
            <IconCalendar size={16} />
          </button>
          <div className="relative">
            <div
              ref={filterAnchorRef}
              className="absolute inset-0 opacity-0 pointer-events-none"
              aria-hidden="true"
            >
              <DateRangePicker
                value={range}
                onChange={(r) => setRange(r)}
                displayMonths={2}
                enableYearNavigation
                translations={{
                  cancel: "Batal",
                  apply: "Ya, Simpan",
                  range: "Rentang",
                }}
                align="end"
                sideOffset={8}
                contentClassName="mt-2 min-w-[560px] rounded-xl border bg-white p-4 shadow-lg"
                footerClassName="mt-3 border-t pt-3 flex justify-end gap-2"
                cancelClassName="rounded-lg bg-gray-100 px-4 py-1.5 text-sm"
                applyClassName="rounded-lg bg-[#6E8649] px-4 py-1.5 text-sm text-white"
              />
            </div>
          </div>

          <button
            onClick={() => setConfirmDownload(true)}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#E2E7D7] bg-white"
          >
            <IconDownload size={16} />
          </button>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#2B3A1D] text-white"
            >
              <IconPencil size={16} />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditing(false);
                  setUpdates([]);
                }}
                className="h-8 rounded-[10px] border px-3 text-sm"
              >
                Batal
              </button>
              <button
                onClick={() => setConfirmSave(true)}
                disabled={pending || updates.length === 0}
                className="h-8 rounded-[10px] bg-[#6E8649] px-3 text-sm text-white disabled:opacity-50"
              >
                {pending ? "Menyimpan…" : "Simpan"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-white shadow overflow-hidden">
        <RekapTable
          initial={initial}
          editing={editing}
          updates={updates}
          onToggle={onToggle}
        />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-2 text-xs text-gray-500">
        <div className="justify-self-start">
          Nominal: {initial.meta?.nominalFormatted}
        </div>
        <div className="justify-self-center">
          <Pagination
            page={initial.page}
            limit={initial.perPage}
            total={initial.total}
          />
        </div>
        <div />
      </div>

      {filterOpen && (
        <FilterModal
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          onApply={(vals) =>
            navigate({ rt: vals.rt, min: vals.min, max: vals.max })
          }
          rtOptions={rtOptions}
          value={{
            rt,
            min: sp.get("min") ? Number(sp.get("min")) : undefined,
            max: sp.get("max") ? Number(sp.get("max")) : undefined,
          }}
          bounds={setoranBounds}
        />
      )}

      <ConfirmDialog
        open={confirmSave}
        onOk={onSave}
        onCancel={() => setConfirmSave(false)}
        title="Konfirmasi"
        description="Yakin ingin menyimpan perubahan?"
      />

      <ConfirmDialog
        open={confirmDownload}
        onOk={() => {
          const params = new URLSearchParams(sp.toString());
          window.location.href = `${API_BASE}/kas/rekap/export?${params}`;
          setConfirmDownload(false);
        }}
        onCancel={() => setConfirmDownload(false)}
        title="Konfirmasi"
        description="Anda yakin ingin mengunduh file ini?"
      />

      <ConfirmDialog
        open={successOpen}
        onOk={() => setSuccessOpen(false)}
        hideCancel
        variant="success"
        okText="Tutup"
        title="Sukses!"
        description="Berhasil menyimpan perubahan."
        autoCloseMs={1600}
      />
    </>
  );
}
