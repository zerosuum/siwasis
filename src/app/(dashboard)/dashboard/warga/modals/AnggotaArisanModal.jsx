"use client";

import * as React from "react";
import { Pencil as IconPencil } from "lucide-react";
import { useToast } from "@/components/ui/useToast";
import { actionAddArisanMember } from "../tambah-warga/actions";

export default function AnggotaArisanModal({ warga, onClose, onSuccess }) {
  const { show } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!warga) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await actionAddArisanMember(warga);
      onSuccess?.();
      onClose();
    } catch (err) {
      show({
        title: "Gagal",
        description: err.message || "Tidak dapat menambah anggota.",
        variant: "error",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-[460px] rounded-2xl bg-white px-6 py-8 md:px-10 md:py-10 shadow-2xl border border-gray-100 animate-[zoomIn_0.2s_ease-out]">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <IconPencil size={20} className="text-gray-800" />
          <h3 className="text-lg font-semibold text-gray-800">
            Tambah Anggota Arisan
          </h3>
        </div>

        {/* Body */}
        <p className="mb-6 text-sm text-gray-600 leading-relaxed">
          Tandai <b>{warga.nama}</b> sebagai anggota Arisan?
        </p>

        {/* Footer */}
        <div className="mt-2 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-[#6E8649] px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : "Ya, Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
}
