"use client";
import * as React from "react";
import { actionAddArisanMember } from "../tambah-warga/actions";
import { useToast } from "@/components/ui/useToast";

export default function AnggotaArisanModal({ warga, onClose, onSuccess }) {
  const { show } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!warga) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await actionAddArisanMember(warga.id);
      onClose();
      onSuccess?.(); 
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[420px] rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="mb-2 text-lg font-semibold">Tambah Anggota Arisan</h3>
        <p className="text-sm text-gray-600 mb-4">
          Tandai <b>{warga.nama}</b> sebagai anggota Arisan & Kas?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg bg-gray-100 px-4 py-1.5 text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-[#6E8649] px-4 py-1.5 text-sm text-white disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : "Ya, Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
}
