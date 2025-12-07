"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar as IconCalendar } from "lucide-react";
import { DateRangePicker } from "@/components/DatePicker";
import { useToast } from "@/components/ui/useToast";
import PeriodDropdown from "./kas/rekapitulasi/PeriodDropdown";
import PeriodModal from "./kas/rekapitulasi/PeriodModal";
import {
  actionCreatePeriod,
  actionDeletePeriod,
  actionUpdatePeriod,
} from "./kas/rekapitulasi/actions";

export default function DashboardHeaderControls({ isLoggedIn, periodes = [] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const { show } = useToast();

  const [range, setRange] = React.useState(
    sp.get("from") && sp.get("to")
      ? { from: new Date(sp.get("from")), to: new Date(sp.get("to")) }
      : undefined
  );
  const [newPeriodOpen, setNewPeriodOpen] = React.useState(false);
  const [editPeriodOpen, setEditPeriodOpen] = React.useState(false);
  const [editingPeriod, setEditingPeriod] = React.useState(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [deletingPeriod, setDeletingPeriod] = React.useState(null);

  const handleSelectPeriode = (periodeId) => {
    const params = new URLSearchParams(sp.toString());
    if (periodeId) params.set("periode", String(periodeId));
    else params.delete("periode");

    router.push(`/dashboard?${params.toString()}`);
    router.refresh();
  };

  const pushWithParams = React.useCallback(
    (extra = {}) => {
      const params = new URLSearchParams(sp.toString());
      const toYMD = (d) =>
        [
          d.getFullYear(),
          String(d.getMonth() + 1).padStart(2, "0"),
          String(d.getDate()).padStart(2, "0"),
        ].join("-");

      if (range?.from && range?.to) {
        params.set("from", toYMD(range.from));
        params.set("to", toYMD(range.to));
      } else {
        params.delete("from");
        params.delete("to");
      }

      Object.entries(extra).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") params.delete(k);
        else params.set(k, String(v));
      });

      router.push(`/dashboard?${params.toString()}`);
      router.refresh();
    },
    [router, sp, range]
  );

  React.useEffect(() => {
    if (range === undefined) {
      pushWithParams();
      return;
    }
    if (range?.from) {
      pushWithParams();
    }
  }, [range, pushWithParams]);

  const filterAnchorRef = React.useRef(null);
  const openCalendar = React.useCallback(() => {
    const root = filterAnchorRef.current;
    if (!root) return;
    const btn =
      root.querySelector('button[aria-haspopup="dialog"]') ||
      root.querySelector("button");
    if (!btn) return;
    ["pointerdown", "mousedown", "mouseup", "click"].forEach((t) =>
      btn.dispatchEvent(
        new MouseEvent(t, { bubbles: true, cancelable: true, view: window })
      )
    );
  }, []);

  const handleCreatePeriod = async ({ name, nominal, from, to }) => {
    try {
      const res = await actionCreatePeriod({ name, nominal, from, to });

      setNewPeriodOpen(false);

      show({
        variant: "success",
        title: "Periode baru dibuat",
        description:
          "Periode berhasil dibuat. Data kas dan arisan otomatis disiapkan.",
      });

      const params = new URLSearchParams(sp.toString());
      params.delete("from");
      params.delete("to");

      if (res?.year) {
        params.set("year", String(res.year));
      }

      router.push(`/dashboard?${params.toString()}`);
      router.refresh();
    } catch (e) {
      console.error("Gagal membuat periode dari Dashboard:", e);
      show({
        variant: "error",
        title: "Gagal membuat periode",
        description:
          e?.message ||
          "Tidak dapat membuat periode baru. Coba lagi beberapa saat lagi.",
      });
    }
  };

  const handleEditClick = (periode) => {
    setEditingPeriod(periode);
    setEditPeriodOpen(true);
  };

  const handleEditSubmit = async ({ id, name, nominal, from, to }) => {
    try {
      const res = await actionUpdatePeriod({ id, name, nominal, from, to });

      setEditPeriodOpen(false);
      setEditingPeriod(null);

      show({
        variant: "success",
        title: "Periode diperbarui",
        description:
          "Periode berhasil diperbarui dan data dashboard sudah di-refresh.",
      });

      const params = new URLSearchParams(sp.toString());

      if (res?.year) {
        params.set("year", String(res.year));
      }

      router.push(`/dashboard?${params.toString()}`);
      router.refresh();
    } catch (e) {
      console.error("Gagal mengedit periode:", e);
      show({
        variant: "error",
        title: "Gagal mengedit periode",
        description:
          e?.message ||
          "Tidak dapat mengedit periode sekarang. Coba lagi beberapa saat lagi.",
      });
    }
  };

  const handleDeleteClick = (periode) => {
    setDeletingPeriod(periode);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPeriod) return;
    try {
      await actionDeletePeriod(deletingPeriod.id);
      show({
        variant: "success",
        title: "Periode dihapus",
        description: `Periode "${deletingPeriod.nama}" berhasil dihapus.`,
      });
    } catch (e) {
      console.error("Gagal menghapus periode:", e);
      show({
        variant: "error",
        title: "Gagal menghapus periode",
        description:
          e?.message ||
          "Tidak dapat menghapus periode. Coba lagi beberapa saat lagi.",
      });
    } finally {
      setConfirmDeleteOpen(false);
      setDeletingPeriod(null);
      router.refresh();
    }
  };

  const handleDeletePeriod = async (periodeId) => {
    if (!periodeId) return;

    const ok = window.confirm(
      "Yakin ingin menghapus periode ini? Semua data kas & arisan di periode tersebut ikut terhapus."
    );
    if (!ok) return;

    try {
      await actionDeletePeriod(periodeId);

      show({
        variant: "success",
        title: "Periode dihapus",
        description:
          "Periode dan seluruh data terkait sudah dihapus dari sistem.",
      });

      const params = new URLSearchParams(sp.toString());

      if (String(periodeId) === sp.get("periode")) {
        params.delete("periode");
      }
      params.delete("from");
      params.delete("to");

      router.push(`/dashboard?${params.toString()}`);
      router.refresh();
    } catch (e) {
      console.error("Gagal menghapus periode:", e);
      show({
        variant: "error",
        title: "Gagal menghapus periode",
        description:
          e?.message ||
          "Tidak dapat menghapus periode. Coba lagi beberapa saat lagi.",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <PeriodDropdown
        options={periodes}
        activeId={
          sp.get("periode")
            ? Number(sp.get("periode"))
            : periodes[0]?.id ?? null
        }
        onSelect={handleSelectPeriode}
        onNew={() => setNewPeriodOpen(true)}
        onEdit={isLoggedIn ? handleEditClick : undefined}
        onDelete={isLoggedIn ? handleDeleteClick : undefined}
        showCreateButton={isLoggedIn}
      />

      <div className="relative">
        <button
          type="button"
          onClick={openCalendar}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E2E7D7] bg-white"
          title="Pilih rentang tanggal"
          aria-label="Pilih rentang tanggal"
        >
          <IconCalendar size={16} />
        </button>

        <div
          ref={filterAnchorRef}
          className="absolute inset-0 pointer-events-none opacity-0"
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
            align="center"
            sideOffset={8}
            contentClassName="mt-2 rounded-xl border bg-white p-4 shadow-lg 
                              min-w-[300px] sm:min-w-[560px]
                              [&>div>div:last-child]:hidden sm:[&>div>div:last-child]:block"
            footerClassName="mt-3 border-t pt-3 flex justify-end gap-2"
            cancelClassName="rounded-lg bg-gray-100 px-4 py-1.5 text-sm"
            applyClassName="rounded-lg bg-[#6E8649] px-4 py-1.5 text-sm text-white"
          />
        </div>
      </div>

      <PeriodModal
        open={newPeriodOpen}
        onClose={() => setNewPeriodOpen(false)}
        onSubmit={handleCreatePeriod}
        mode="create"
      />

      <PeriodModal
        open={editPeriodOpen}
        onClose={() => {
          setEditPeriodOpen(false);
          setEditingPeriod(null);
        }}
        onSubmit={handleEditSubmit}
        mode="edit"
        initialPeriod={editingPeriod}
      /> 

      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-[380px] rounded-2xl bg-white px-6 py-6 shadow-2xl border border-gray-100">
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Hapus periode?
            </h3>
            <p className="text-sm text-gray-600">
              Periode{" "}
              <span className="font-semibold">
                {deletingPeriod?.nama ?? ""}
              </span>{" "}
              dan semua data terkait (kas & arisan) akan dihapus permanen.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                onClick={() => {
                  setConfirmDeleteOpen(false);
                  setDeletingPeriod(null);
                }}
              >
                Batal
              </button>
              <button
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                onClick={handleDeleteConfirm}
              >
                Ya, hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
