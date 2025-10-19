"use client";

import * as React from "react";
import { Pencil as IconPencil, Calendar as IconCalendar } from "lucide-react";

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

export default function TransaksiModal({
  open,
  onClose,
  onSubmit,
  title,
  submitText = "Tambah",
  initialData = {},
}) {
  const [tanggal, setTanggal] = React.useState(initialData?.tanggal || "");
  const [keterangan, setKeterangan] = React.useState(
    initialData?.keterangan || ""
  );
  const [nominal, setNominal] = React.useState(initialData?.nominal || "");

  React.useEffect(() => {
    if (!open) return;
    setTanggal(initialData?.tanggal || "");
    setKeterangan(initialData?.keterangan || "");
    // simpan sebagai string supaya gampang di-edit
    setNominal(
      initialData?.nominal !== undefined && initialData?.nominal !== null
        ? String(initialData.nominal)
        : ""
    );
    // depend cuma ke "open"
  }, [open]);

  if (!open) return null;

  const handleSubmit = () => {
  onSubmit?.({
  tanggal,
  keterangan,
  nominal: nominal === "" ? 0 : Number(nominal),
 });    
};

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-[420px] rounded-2xl bg-white px-10 py-12 shadow-2xl border border-gray-100">
        <div className="animate-[zoomIn_0.2s_ease-out] mb-6 flex items-center gap-3">
          <IconPencil size={20} className="text-gray-800" />
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>

        <div className="space-y-4">
          <FormField label="Tanggal *">
            <div className="relative">
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                onFocus={(e) => e.target.showPicker?.()}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
              />
              <IconCalendar
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">Tanggal wajib diisi!</p>
          </FormField>

          <FormField label="Keterangan">
            <textarea
              rows={3}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
              placeholder="Masukkan keterangan transaksi"
            />
          </FormField>

          <FormField label="Nominal *">
            <input
              type="number"
              inputMode="numeric"
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              placeholder="Contoh: 50000"
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
            />
            <p className="mt-1 text-xs text-gray-400">Nominal wajib diisi!</p>
          </FormField>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="rounded-lg bg-[#6E8649] px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
            onClick={handleSubmit}
          >
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
}
