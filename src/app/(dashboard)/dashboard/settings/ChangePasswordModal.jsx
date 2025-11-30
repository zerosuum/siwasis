// src/app/(dashboard)/dashboard/settings/ChangePasswordModal.jsx
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

export default function ChangePasswordModal({ open, onClose, onSubmit }) {
  const [oldPwd, setOldPwd] = React.useState("");
  const [newPwd, setNewPwd] = React.useState("");
  const [newPwd2, setNewPwd2] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const can = oldPwd && newPwd && newPwd === newPwd2;

  React.useEffect(() => {
    if (!open) {
      setOldPwd("");
      setNewPwd("");
      setNewPwd2("");
      setSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  async function submit() {
    if (!can || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit?.({
        old_password: oldPwd,
        password: newPwd,
        password_confirmation: newPwd2,
      });
      onClose?.();
    } catch {
      // toast sudah dihandle di parent
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <div className="w-full max-w-[460px] rounded-2xl bg-white px-6 py-8 md:px-10 md:py-10 shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Ubah Password</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-gray-100"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <FormField label="Password Lama *">
            <input
              type="password"
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3
                         text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
              value={oldPwd}
              onChange={(e) => setOldPwd(e.target.value)}
            />
          </FormField>

          <FormField label="Password Baru *">
            <input
              type="password"
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3
                         text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
            />
          </FormField>

          <FormField label="Konfirmasi Password Baru *">
            <input
              type="password"
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3
                         text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
              value={newPwd2}
              onChange={(e) => setNewPwd2(e.target.value)}
            />
          </FormField>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button disabled={!can || submitting} onClick={submit}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
