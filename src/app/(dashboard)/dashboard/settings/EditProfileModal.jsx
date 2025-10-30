"use client";
import * as React from "react";
import { Modal, Button, Input, Label } from "@/components/ui/UI";

export default function EditProfileModal({ open, onClose, onSubmit, initial }) {
  const [name, setName] = React.useState(initial?.name || "");
  const [email, setEmail] = React.useState(initial?.email || "");

  React.useEffect(() => {
    if (open) {
      setName(initial?.name || "");
      setEmail(initial?.email || "");
    }
  }, [open, initial?.name, initial?.email]);

  return (
    <Modal
      title="Edit Profile"
      open={open}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button
            disabled={!name || !email}
            onClick={() => onSubmit?.({ name, email })}
          >
            Simpan
          </Button>
        </>
      }
    >
      <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
        Drag and drop
        <br />
        or
        <br />
        Choose Image
      </div>
      <div className="space-y-3">
        <div>
          <Label>Nama *</Label>
          <Input
            placeholder="Masukkan username..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label>Email *</Label>
          <Input
            placeholder="admin@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
