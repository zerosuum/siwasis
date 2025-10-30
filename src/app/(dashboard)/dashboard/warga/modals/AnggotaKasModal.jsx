"use client";
import * as React from "react";
import { addKasMember } from "@/server/queries/warga";

export default function AnggotaKasModal({ warga, onClose, onSuccess }) {
  if (!warga) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[420px] rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="mb-2 text-lg font-semibold">Tambah Anggota Kas</h3>
        <p className="text-sm text-gray-600 mb-4">
          Tandai <b>{warga.nama}</b> sebagai anggota Kas?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-4 py-1.5 text-sm"
          >
            Batal
          </button>
          <button
            onClick={async () => {
              await addKasMember(warga.id);
              onClose();
              onSuccess?.();
            }}
            className="rounded-lg bg-[#6E8649] px-4 py-1.5 text-sm text-white"
          >
            Ya, Tambah
          </button>
        </div>
      </div>
    </div>
  );
}
