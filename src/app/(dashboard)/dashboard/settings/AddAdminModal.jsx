"use client";
import * as React from "react";
import { Button } from "@/components/ui/UI";
import { X as IconX } from "lucide-react";

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

export default function AddAdminModal({ open, onClose, onSubmit }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [pwd, setPwd] = React.useState("");
  const [pwd2, setPwd2] = React.useState("");

  const can = name && email && pwd && pwd === pwd2;

  React.useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setPwd("");
      setPwd2("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <div className="w-full max-w-[460px] rounded-2xl bg-white px-6 py-8 md:px-10 md:py-10 shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Tambahkan admin baru
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-gray-100"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <FormField label="Nama *">
            <input
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3
                         text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama..."
            />
          </FormField>

          <FormField label="Email *">
            <input
              type="email"
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3
                         text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
            />
          </FormField>

          <FormField label="Password *">
            <input
              type="password"
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3
                         text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Minimal 8 karakter"
            />
          </FormField>

          <FormField label="Konfirmasi Password *">
            <input
              type="password"
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3
                         text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
              value={pwd2}
              onChange={(e) => setPwd2(e.target.value)}
              placeholder="Ulangi password"
            />
          </FormField>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button
            disabled={!can}
            onClick={() =>
              onSubmit?.({
                name,
                email,
                password: pwd,
                password_confirmation: pwd2,
              })
            }
          >
            Tambah
          </Button>
        </div>
      </div>
    </div>
  );
}
