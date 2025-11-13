"use client";

import * as React from "react";
import { DateRangePicker } from "@/components/DatePicker";
import { Pencil as IconPencil, Calendar as IconCalendar } from "lucide-react";

export default function PeriodModal({ open, onClose, onSubmit }) {
  const [name, setName] = React.useState("");
  const [nominal, setNominal] = React.useState("");
  const [range, setRange] = React.useState();

  React.useEffect(() => {
    if (!open) return;
    const next = new Date().getFullYear() + 1;
    setName(`Periode ${next}`);
    setNominal("");
    setRange(undefined);
  }, [open]);

  if (!open) return null;

  const ok = () => {
    const from = range?.from?.toISOString?.().slice(0, 10);
    const to = range?.to?.toISOString?.().slice(0, 10);
    onSubmit?.({
      name: name?.trim(),
      nominal: nominal === "" ? 0 : Number(nominal),
      from,
      to,
    });
  };

  const valid =
    name?.trim() &&
    nominal !== "" &&
    !Number.isNaN(Number(nominal)) &&
    range?.from &&
    range?.to;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-[460px] rounded-2xl bg-white px-6 py-8 md:px-10 md:py-10 shadow-2xl border border-gray-100">
        <div className="mb-6 flex items-center gap-3">
          <IconPencil size={20} className="text-gray-800" />
          <h3 className="text-lg font-semibold text-gray-800">
            Mulai Periode Baru
          </h3>
        </div>

        <div className="space-y-4">
          <Field label="Nama Periode *">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Periode 2027"
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
            />
            <p className="mt-1 text-xs text-gray-400">
              Nama periode wajib diisi!
            </p>
          </Field>

          <Field label="Nominal *">
            <input
              type="number"
              inputMode="numeric"
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              placeholder="Rp. 10.000"
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
            />
            <p className="mt-1 text-xs text-gray-400">Nominal wajib diisi!</p>
          </Field>

          <Field label="Tanggal *">
            <div>
              <button
                type="button"
                onClick={(e) => {
                  const root = e.currentTarget.nextElementSibling;
                  const btn =
                    root?.querySelector('button[aria-haspopup="dialog"]') ||
                    root?.querySelector("button");
                  if (!btn) return;
                  ["pointerdown", "mousedown", "mouseup", "click"].forEach(
                    (t) =>
                      btn.dispatchEvent(
                        new MouseEvent(t, {
                          bubbles: true,
                          cancelable: true,
                          view: window,
                        })
                      )
                  );
                }}
                className="relative flex items-center justify-between h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
              >
                <span
                  className={range?.from ? "text-gray-900" : "text-gray-400"}
                >
                  {range?.from && range?.to
                    ? `${range.from.toLocaleDateString(
                        "id-ID"
                      )} – ${range.to.toLocaleDateString("id-ID")}`
                    : "pilih rentang waktu"}
                </span>

                <IconCalendar size={16} className="text-gray-400" />
              </button>

              <div
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
                  align="center"
                  sideOffset={8}
                  contentClassName="z-[60] mt-2 min-w-[560px] rounded-xl border bg-white p-4 shadow-lg"
                  footerClassName="mt-3 border-t pt-3 flex justify-end gap-2"
                  cancelClassName="rounded-lg bg-gray-100 px-4 py-1.5 text-sm"
                  applyClassName="rounded-lg bg-[#6E8649] px-4 py-1.5 text-sm text-white"
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">Tanggal wajib diisi!</p>
            </div>
          </Field>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            disabled={!valid}
            className="rounded-lg bg-[#6E8649] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            onClick={ok}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-500">
        {label}
      </label>
      {children}
    </div>
  );
}
