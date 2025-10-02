"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DateRangePicker } from "@/components/DatePicker";
import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation";
import RekapTable from "./RekapTable";
import { useToast } from "@/components/ui/useToast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { actionSaveRekap } from "./actions";
import {
  Calendar as IconCalendar,
  Search as IconSearch,
  SlidersHorizontal as IconFilter,
  Download as IconDownload,
  Pencil as IconPencil,
} from "lucide-react";

export default function RekapClient({ initial }) {
  const router = useRouter();
  const sp = useSearchParams();
  const { show } = useToast();

  // State declarations
  const [year, setYear] = React.useState(
    Number(sp.get("year")) || new Date().getFullYear()
  );
  const [q, setQ] = React.useState(sp.get("q") || "");
  const [rt, setRt] = React.useState(sp.get("rt") || "");
  const [range, setRange] = React.useState(
    sp.get("from") && sp.get("to")
      ? { from: new Date(sp.get("from")), to: new Date(sp.get("to")) }
      : undefined
  );
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [showRange, setShowRange] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const [updates, setUpdates] = React.useState([]);

  // Helper functions
  const onToggle = React.useCallback((wargaId, tanggal, checked) => {
    setUpdates((prev) => {
      const key = `${wargaId}-${tanggal}`;
      const next = prev.filter((u) => `${u.wargaId}-${u.tanggal}` !== key);
      next.push({ wargaId, tanggal, checked });
      return next;
    });
  }, []);

  const applyFilter = React.useCallback(() => {
    const params = new URLSearchParams(sp.toString());
    params.set("year", String(year));
    params.set("q", q);
    params.set("rt", rt);
    if (range?.from && range?.to) {
      params.set("from", range.from.toISOString().slice(0, 10));
      params.set("to", range.to.toISOString().slice(0, 10));
    } else {
      params.delete("from");
      params.delete("to");
    }
    router.push(`/kas/rekapitulasi?${params.toString()}`);
  }, [year, q, rt, range, sp, router]);

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
        show({
          title: "Sukses!",
          description: "Berhasil menyimpan perubahan.",
        });
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

  React.useEffect(() => {
    const params = new URLSearchParams(sp.toString());
    params.set("year", String(year));
    router.push(`/kas/rekapitulasi?${params.toString()}`);
  }, [year]);

  return (
    <>
      {/* ======================================================================
          HEADER "FLOATING": TABS DAN TOOLBAR (DI LUAR CARD)
      ====================================================================== */}
      <div className="flex items-center justify-between gap-3 px-4 pt-3">
        {/* KIRI: TABS */}
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

        {/* KANAN: TOOLBAR */}
        <div className="flex items-center gap-2">
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
              onKeyDown={(e) => e.key === "Enter" && applyFilter()}
              placeholder="Cari nama warga..."
              className={`h-6 rounded border border-gray-300 bg-white pl-7 pr-2 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-gray-200 ${
                searchOpen || q ? "w-48" : "w-6"
              }`}
            />
          </div>
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 bg-white"
            title="Filter"
          >
            <IconFilter size={16} />
          </button>
          <button
            type="button"
            onClick={() => setShowRange((v) => !v)}
            className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 bg-white"
            title="Pilih rentang tanggal"
          >
            <IconCalendar size={16} />
          </button>
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 bg-white"
            onClick={() =>
              show({ title: "Unduh", description: "Menyiapkan file…" })
            }
            title="Unduh"
          >
            <IconDownload size={16} />
          </button>
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

      {/* Popover untuk DateRangePicker */}
      {showRange && (
        <div className="relative px-4">
          <div className="absolute right-4 top-2 z-20">
            <DateRangePicker
              value={range}
              onChange={(r) => {
                setRange(r);
                setShowRange(false);
                setTimeout(applyFilter, 0);
              }}
              translations={{
                cancel: "Batal",
                apply: "Terapkan",
                range: "Rentang",
              }}
              enableYearNavigation
            />
          </div>
        </div>
      )}

      {/* ======================================================================
          KONTEN UTAMA: HANYA TABEL DI DALAM CARD
      ====================================================================== */}
      <div className="rounded-xl bg-white shadow">
        <RekapTable
          initial={initial}
          editing={editing}
          updates={updates}
          onToggle={onToggle}
        />
      </div>

      {/* ======================================================================
          FOOTER "FLOATING": NOMINAL DAN PAGINATION (DI LUAR CARD)
      ====================================================================== */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500">
        <div>Nominal: {initial.meta?.nominalFormatted}</div>
        <div>
          <span>Pagination akan muncul di sini</span>
        </div>
      </div>

      {/* ======================================================================
          MODAL-MODAL
      ====================================================================== */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-lg">
            <h3 className="text-lg font-semibold">Filter Lanjutan</h3>
            <p className="mt-2 text-sm text-gray-600">
              Opsi filter akan muncul di sini.
            </p>
            <div className="mt-4 text-right">
              <button
                onClick={() => {
                  setFilterOpen(false);
                  applyFilter();
                }}
                className="rounded bg-[#6E8649] px-4 py-2 text-sm text-white"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={confirm}
        title="Konfirmasi"
        description="Yakin ingin menyimpan perubahan?"
        cancelText="Batal"
        okText="Ya, Simpan"
        onCancel={() => setConfirm(false)}
        onOk={onSave}
      />
    </>
  );
}
