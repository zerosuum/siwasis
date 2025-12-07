"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar as IconCalendar } from "lucide-react";
import { DateRangePicker } from "@/components/DatePicker";
import { useToast } from "@/components/ui/useToast";
import PeriodDropdown from "./kas/rekapitulasi/PeriodDropdown";
import PeriodModal from "./kas/rekapitulasi/PeriodModal";
import { actionCreatePeriod } from "./kas/rekapitulasi/actions";

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
      />
    </div>
  );
}
