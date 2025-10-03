"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DateRangePicker } from "@/components/DatePicker";
import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation";
import RekapTable from "./RekapTable";
import Pagination from "@/components/Pagination"; // ⬅️ added
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

const PER_PAGE = 10; // ⬅️ page size

export default function RekapClient({ initial }) {
  const router = useRouter();
  const sp = useSearchParams();
  const { show } = useToast();

  // Query/state dasar
  const page = Number(sp.get("page")) || 1; // ⬅️ current page dari URL
  const [year, setYear] = React.useState(
    Number(sp.get("year")) || new Date().getFullYear()
  );
  const [q, setQ] = React.useState(sp.get("q") || "");
  const [rt, setRt] = React.useState(sp.get("rt") || "all");

  const initRange =
    sp.get("from") && sp.get("to")
      ? { from: new Date(sp.get("from")), to: new Date(sp.get("to")) }
      : undefined;
  const [range, setRange] = React.useState(initRange);

  const [searchOpen, setSearchOpen] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [confirmDownload, setConfirmDownload] = React.useState(false);

  const [editing, setEditing] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const [updates, setUpdates] = React.useState([]);

  // Data untuk FilterModal
  const rtOptions = React.useMemo(() => {
    const s = new Set();
    (initial?.rows || []).forEach((r) => r?.rt && s.add(String(r.rt)));
    return Array.from(s).sort();
  }, [initial]);

  const setoranBounds = React.useMemo(() => {
    const vals = (initial?.rows || []).map((r) => Number(r.totalSetoran || 0));
    if (!vals.length) return { min: 0, max: 0 };
    return { min: Math.min(...vals), max: Math.max(...vals) };
  }, [initial]);

  // Helpers
  const onToggle = React.useCallback((wargaId, tanggal, checked) => {
    setUpdates((prev) => {
      const key = `${wargaId}-${tanggal}`;
      const next = prev.filter((u) => `${u.wargaId}-${u.tanggal}` !== key);
      next.push({ wargaId, tanggal, checked });
      return next;
    });
  }, []);

  const applyURL = React.useCallback(
    (next = {}) => {
      const params = new URLSearchParams(sp.toString());
      const nextYear = next.year ?? year;
      const nextQ = next.q ?? q;
      const nextRt = next.rt ?? rt;
      const r = next.range ?? range;

      params.set("year", String(nextYear));
      // reset ke halaman 1 setiap filter berubah
      params.set("page", "1");

      nextQ ? params.set("q", String(nextQ)) : params.delete("q");
      // ⬇️ jangan kirim 'all' ke URL
      nextRt && nextRt !== "all"
        ? params.set("rt", String(nextRt))
        : params.delete("rt");

      if (r?.from && r?.to) {
        params.set("from", r.from.toISOString().slice(0, 10));
        params.set("to", r.to.toISOString().slice(0, 10));
      } else {
        params.delete("from");
        params.delete("to");
      }
      router.push(`/kas/rekapitulasi?${params.toString()}`);
    },
    [sp, router, year, q, rt, range]
  );

  const onSave = async () => {
    setConfirm(false);
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append(
          "payload",
          JSON.stringify({
            year,
            updates,
            from: sp.get("from") || null,
            to: sp.get("to") || null,
          })
        );
        await actionSaveRekap(fd);
        setEditing(false);
        setUpdates([]);
        show({ title: "Sukses!", description: "Berhasil menyimpan perubahan." });
        router.refresh();
      } catch (e) {
        console.error(e);
        show({
          title: "Gagal",
          description: "Simpan gagal. Coba lagi.",
          variant: "error",
        });
      }
    });
  };

  // sinkron tahun URL saat berubah manual (reset page=1)
  React.useEffect(() => {
    const params = new URLSearchParams(sp.toString());
    params.set("year", String(year));
    params.set("page", "1"); // ⬅️ reset page
    router.push(`/kas/rekapitulasi?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  // auto-apply ketika from+to lengkap
  React.useEffect(() => {
    if (range?.from && range?.to) applyURL({ range });
  }, [range?.from, range?.to]); // eslint-disable-line react-hooks/exhaustive-deps

  // DateRangePicker dari ikon toolbar (anchor tak terlihat)
  const calAnchorRef = React.useRef(null);
  const openCalendar = React.useCallback(() => {
    if (!calAnchorRef.current) return;
    const root = calAnchorRef.current;
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

  const total = Array.isArray(initial?.rows) ? initial.rows.length : 0; // ⬅️ for Pagination

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4">
        <TabNavigation className="!mb-0 h-6">
          <TabNavigationLink
            href="/kas/rekapitulasi"
            active
            className="inline-flex h-6 items-center border-b-2 !border-[#6E8649] px-2 text-sm font-medium !text-[#6E8649]"
          >
            Rekapitulasi Pembayaran
          </TabNavigationLink>
          <TabNavigationLink
            href="/kas/laporan"
            className="inline-flex h-6 items-center px-2 text-sm font-medium text-gray-400 hover:text-gray-600"
          >
            Laporan Keuangan
          </TabNavigationLink>
        </TabNavigation>

        <div className="flex items-center gap-2">
          {/* Periode */}
          <select
            className="h-6 w-[138px] rounded border border-gray-300 bg-white px-2 text-sm shadow-sm"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
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

          {/* Pencarian */}
          <div
            className="relative"
            onMouseEnter={() => setSearchOpen(true)}
            onMouseLeave={() => (q ? null : setSearchOpen(false))}
          >
            <IconSearch
              size={16}
              className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyURL({ q })}
              placeholder="Cari nama warga..."
              className={`h-6 rounded border border-gray-300 bg-white pl-7 pr-2 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-gray-200 ${
                searchOpen || q ? "w-48" : "w-6"
              }`}
            />
          </div>

          {/* Filter → buka FilterModal project */}
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 bg-white"
            title="Filter"
          >
            <IconFilter size={16} />
          </button>

          {/* Kalender */}
          <div className="relative">
            <button
              type="button"
              onClick={openCalendar}
              className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 bg-white"
              title="Pilih rentang tanggal"
              aria-label="Pilih rentang tanggal"
            >
              <IconCalendar size={16} />
            </button>

            <div
              ref={calAnchorRef}
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

          {/* Export dengan konfirmasi */}
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 bg-white"
            title="Unduh"
            onClick={() => setConfirmDownload(true)}
          >
            <IconDownload size={16} />
          </button>

          {/* Edit / Simpan */}
          {!editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex h-6 w-6 items-center justify-center rounded bg-[#0F172A] text-white"
              title="Edit"
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
                className="h-6 rounded border px-2 text-sm"
              >
                Batal
              </button>
              <button
                onClick={() => setConfirm(true)}
                disabled={pending || updates.length === 0}
                className="h-6 rounded bg-[#334a2a] px-2 text-sm text-white disabled:opacity-50"
              >
                {pending ? "Menyimpan…" : "Simpan"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabel */}
      <div className="rounded-xl bg-white shadow overflow-hidden">
        <RekapTable
          initial={initial}
          editing={editing}
          updates={updates}
          onToggle={onToggle}
          page={page}                // ⬅️ pass page
          pageSize={PER_PAGE}        // ⬅️ pass page size
        />
      </div>

      {/* Footer meta & pagination */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500">
        <div>Nominal: {initial.meta?.nominalFormatted}</div>
        <Pagination page={page} limit={PER_PAGE} total={total} /> {/* ⬅️ show pager */}
      </div>

      {/* Filter Modal */}
      {filterOpen && (
        <FilterModal
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          onApply={(vals) => {
            setRt(vals.rt);
            setFilterOpen(false);
            applyURL({ rt: vals.rt });
          }}
          rtOptions={rtOptions}
          value={{ rt, min: setoranBounds.min, max: setoranBounds.max }}
          bounds={setoranBounds}
        />
      )}

      {/* Confirm Simpan Edit */}
      <ConfirmDialog
        open={confirm}
        title="Konfirmasi"
        description="Yakin ingin menyimpan perubahan?"
        cancelText="Batal"
        okText="Ya, Simpan"
        onCancel={() => setConfirm(false)}
        onOk={onSave}
      />

      {/* Confirm Download */}
      <ConfirmDialog
        open={confirmDownload}
        title="Konfirmasi"
        description="Apakah Anda yakin ingin mengunduh file ini?"
        cancelText="Batal"
        okText="Ya, Unduh"
        onCancel={() => setConfirmDownload(false)}
        onOk={() => {
          setConfirmDownload(false);
          const params = new URLSearchParams({
            year: String(year),
            ...(range?.from && range?.to
              ? {
                  from: range.from.toISOString().slice(0, 10),
                  to: range.to.toISOString().slice(0, 10),
                }
              : {}),
            ...(q ? { q } : {}),
            // ⬇️ jangan kirim 'all'
            ...(rt && rt !== "all" ? { rt } : {}),
          });
          window.location.href = `/api/kas/rekapitulasi/export?${params.toString()}`;
        }}
      />
    </>
  );
}
