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
import { actionSaveRekap, actionCreatePeriod } from "./actions";
import {
  Calendar as IconCalendar,
  Search as IconSearch,
  SlidersHorizontal as IconFilter,
  Download as IconDownload,
  Pencil as IconPencil,
} from "lucide-react";
import { API_BASE } from "@/lib/config";
import PeriodDropdown from "./PeriodDropdown";
import PeriodModal from "./PeriodModal";

export default function RekapClient({ initial, readOnly }) {
  const router = useRouter();
  const sp = useSearchParams();
  const { show } = useToast();

  const page = initial?.page || 1;

  const metaYear = initial?.meta?.year;
  const urlYear = sp.get("year") ? Number(sp.get("year")) : null;
  const year = metaYear || urlYear || new Date().getFullYear();

  const q = sp.get("q") || "";
  const rt = sp.get("rt") || "all";
  const from = sp.get("from");
  const to = sp.get("to");

  const periodeId =
    initial?.meta?.periodeId || sp.get("periode_id")
      ? Number(initial?.meta?.periodeId || sp.get("periode_id"))
      : null;

  const [searchQuery, setSearchQuery] = React.useState(q);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);

  const [editing, setEditing] = React.useState(false);
  const [updates, setUpdates] = React.useState([]);
  const [confirmSave, setConfirmSave] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const [confirmDownload, setConfirmDownload] = React.useState(false);
  // const [successOpen, setSuccessOpen] = React.useState(false);
  const filterBtnRef = React.useRef(null);
  const initRange =
    sp.get("from") && sp.get("to")
      ? { from: new Date(sp.get("from")), to: new Date(sp.get("to")) }
      : undefined;
  const [range, setRange] = React.useState(initRange);

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

  React.useEffect(() => {
    if (!range?.from || !range?.to) return;

    const params = new URLSearchParams(sp.toString());

    if (sp.get("rt")) params.set("rt", sp.get("rt"));
    if (sp.get("q")) params.set("q", sp.get("q"));

    params.set("year", String(year));
    const toLocalYMD = (d) =>
      [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
      ].join("-");
    params.set("from", toLocalYMD(range.from));
    params.set("to", toLocalYMD(range.to));

    params.set("page", "1");

    router.push(`/dashboard/kas/rekapitulasi?${params.toString()}`);
  }, [range?.from, range?.to]);

  const navigate = (newParams) => {
    const params = new URLSearchParams(sp.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
      else params.delete(k);
    });
    if (!newParams.page) params.set("page", "1");
    router.push(`/dashboard/kas/rekapitulasi?${params.toString()}`);
  };

  const onToggle = React.useCallback((wargaId, tanggal, checked) => {
    setUpdates((prev) => {
      const key = `${wargaId}-${tanggal}`;
      const next = prev.filter((u) => `${u.wargaId}-${u.tanggal}` !== key);
      next.push({ wargaId, tanggal, checked });
      return next;
    });
  }, []);

  const onSave = async () => {
    setConfirmSave(false);
    startTransition(async () => {
      try {
        const nominal = Number(initial?.meta?.nominal ?? 0);

        const normalized = updates.map((u) => ({
          wargaId: u.wargaId,
          tanggal: u.tanggal,
          checked: u.checked,
          status: u.checked ? "sudah_bayar" : "belum_bayar",
          jumlah: u.checked ? nominal : 0,
        }));

        await actionSaveRekap({
          periodeId: initial.periodeId,
          updates: normalized,
        });

        setEditing(false);
        setUpdates([]);
        show({
          title: "Sukses!",
          description: "Rekap kas berhasil disimpan.",
        });

        const params = new URLSearchParams(sp.toString());
        params.set("_v", String(Date.now()));
        router.replace(`/dashboard/kas/rekapitulasi?${params.toString()}`);
        router.refresh();
      } catch (e) {
        console.error(e);
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

  const [newPeriodOpen, setNewPeriodOpen] = React.useState(false);
  const handleSelectYear = (y) => {
    // pindah periode, bersihkan range biar nggak bentrok
    navigate({ year: y, from: "", to: "" });
  };

  const handleCreatePeriod = async ({ name, nominal, from, to }) => {
    try {
      const res = await actionCreatePeriod({ name, nominal, from, to });
      setNewPeriodOpen(false);
      show({ title: "Sukses!", description: "Periode baru dibuat." });

      const y = Number(res?.year) || year;
      const params = new URLSearchParams(sp.toString());
      params.set("year", String(y));
      params.delete("from");
      params.delete("to");
      params.set("page", "1");
      router.push(`/dashboard/kas/rekapitulasi?${params.toString()}`);
      router.refresh();
    } catch (e) {
      console.error(e);
      show({
        title: "Gagal",
        description: "Tidak dapat membuat periode baru.",
        variant: "error",
      });
    }
  };

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
          <PeriodDropdown
            activeId={initial.periodeId}
            options={initial.periodes || []}
            onSelect={(id) => {
              const params = new URLSearchParams(sp.toString());

              if (id) params.set("periode_id", String(id));
              else params.delete("periode_id");

              params.set("page", "1");
              router.push(`/dashboard/kas/rekapitulasi?${params.toString()}`);
            }}
          />

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
            ref={filterBtnRef}
            onClick={() => setFilterOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#E2E7D7] bg-white"
          >
            <IconFilter size={16} />
          </button>

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

          {!readOnly && (
            <button
              onClick={() => setConfirmDownload(true)}
              className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#E2E7D7] bg-white"
            >
              <IconDownload size={16} />
            </button>
          )}

          {!readOnly && (
            <>
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
            </>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-white shadow overflow-hidden">
        <RekapTable
          initial={initial}
          editing={editing}
          updates={updates}
          onToggle={onToggle}
          readOnly={readOnly}
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
          anchorEl={filterBtnRef.current}
          align="right"
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

      {!readOnly && (
        <ConfirmDialog
          open={confirmSave}
          onOk={onSave}
          onCancel={() => setConfirmSave(false)}
          title="Konfirmasi"
          description="Yakin ingin menyimpan perubahan?"
        />
      )}

      {!readOnly && (
        <ConfirmDialog
          open={confirmDownload}
          title="Konfirmasi"
          description="Anda yakin ingin mengunduh rekapitulasi kas?"
          cancelText="Batal"
          okText="Ya, Unduh"
          onCancel={() => setConfirmDownload(false)}
          onOk={() => {
            setConfirmDownload(false);

            const params = new URLSearchParams(sp.toString());
            params.delete("q");

            show({
              variant: "warning",
              title: "Mengunduh rekapitulasi",
              description:
                "Jika unduhan tidak mulai otomatis, coba ulangi beberapa saat lagi.",
            });

            window.location.href = `/api/proxy/kas/rekap/export?${params.toString()}`;
          }}
        />
      )}

      {/* {!readOnly && (
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
      )} */}

      {!readOnly && (
        <PeriodModal
          open={newPeriodOpen}
          onClose={() => setNewPeriodOpen(false)}
          onSubmit={handleCreatePeriod}
        />
      )}
    </>
  );
}
