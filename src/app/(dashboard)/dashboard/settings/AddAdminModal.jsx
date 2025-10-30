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

  return (
    <Modal
      title="Tambahkan admin baru"
      open={open}
      onClose={onClose}
      footer={
        <>
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
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700">Nama *</label>
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Email *</label>
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            Password *
          </label>
          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            Konfirmasi Password *
          </label>
          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            value={pwd2}
            onChange={(e) => setPwd2(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
