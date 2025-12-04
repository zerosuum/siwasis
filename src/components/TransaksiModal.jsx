"use client";

import * as React from "react";
import { Pencil as IconPencil } from "lucide-react";
import { DatePicker } from "@/components/DatePicker";

function FormField({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-500">
        {label}
      </label>
      {children}
    </div>
  );
}

function parseYMD(dateString) {
  if (!dateString) return undefined;
  const parts = dateString.split("-");
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function toYMD(date) {
  if (!date) return "";
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export default function TransaksiModal({
  open,
  onClose,
  onSubmit,
  title,
  submitText = "Tambah",
  initialData = {},
  submitting = false,
}) {
  const [tanggal, setTanggal] = React.useState(parseYMD(initialData?.tanggal));
  const [keterangan, setKeterangan] = React.useState(
    initialData?.keterangan || ""
  );
  const [nominal, setNominal] = React.useState(initialData?.nominal || "");

  React.useEffect(() => {
    if (!open) return;

    setTanggal(parseYMD(initialData?.tanggal));
    setKeterangan(initialData?.keterangan || "");
    setNominal(
      initialData?.nominal !== undefined && initialData?.nominal !== null
        ? String(initialData.nominal)
        : ""
    );
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-[460px] rounded-2xl bg-white px-6 py-8 md:px-10 md:py-10 shadow-2xl border border-gray-100">
        <div className="animate-[zoomIn_0.2s_ease-out] mb-6 flex items-center gap-3">
          <IconPencil size={20} className="text-gray-800" />
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.({
              tanggal: toYMD(tanggal),
              keterangan,
              nominal: nominal === "" ? 0 : Number(nominal),
            });
          }}
          className="space-y-4"
        >
          <FormField label="Tanggal *">
            <DatePicker
              value={tanggal}
              onChange={setTanggal}
              placeholder="Pilih tanggal"
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
              align="center"
              sideOffset={8}
              contentClassName="mt-2 rounded-xl border bg-white p-4 shadow-lg 
                                min-w-[300px] sm:min-w-[auto]
                                [&>div>div:last-child]:hidden sm:[&>div>div:last-child]:block"
            />
            <p className="mt-1 text-xs text-gray-400">Tanggal wajib diisi!</p>
          </FormField>

          <FormField label="Keterangan">
            <textarea
              rows={3}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
            />
          </FormField>

          <FormField label="Nominal *">
            <input
              type="number"
              inputMode="numeric"
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
            />
            <p className="mt-1 text-xs text-gray-400">Nominal wajib diisi!</p>
          </FormField>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={submitting || !tanggal || !nominal}
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white
                  ${ submitting ? "bg-[#6E8649]/70 cursor-wait" : "bg-[#6E8649] hover:bg-opacity-90" }
                  disabled:opacity-50`}
            >
              {submitting ? "Memproses..." : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
