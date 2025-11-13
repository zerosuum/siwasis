"use client";
import * as React from "react";
import { Button } from "@/components/ui/UI";
import { X as IconX } from "lucide-react";

function Modal({ title, open, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 mx-auto mt-20 w-[560px] max-w-[95vw] rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-gray-100"
          >
            <IconX size={18} />
          </button>
        </div>
        <div className="space-y-3">{children}</div>
        {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
      </div>
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

    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      title="Ubah Password"
      open={open}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button disabled={!can || submitting} onClick={submit}>
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Password Lama *
          </label>
          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            value={oldPwd}
            onChange={(e) => setOldPwd(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            Password Baru *
          </label>
          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            Konfirmasi Password Baru *
          </label>
          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            value={newPwd2}
            onChange={(e) => setNewPwd2(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
