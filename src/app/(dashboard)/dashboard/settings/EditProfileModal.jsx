"use client";
import * as React from "react";
import { Modal, Button, Input, Label } from "@/components/ui/UI";
import ImageDropzone from "@/components/ImageDropzone";

export default function EditProfileModal({
  open,
  onClose,
  onSubmit,
  initial,
  loading = false,
}) {
  const [name, setName] = React.useState(initial?.name || "");
  const [email, setEmail] = React.useState(initial?.email || "");
  const [file, setFile] = React.useState(null);

  React.useEffect(() => {
    if (open) {
      setName(initial?.name || "");
      setEmail(initial?.email || "");
      setFile(null);
    }
  }, [open, initial?.name, initial?.email]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(f);
    }
  };

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
            disabled={!name || !email || loading}
            onClick={() => onSubmit?.({ name, email, photo: file })}
          >
            Simpan
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center justify-center gap-6 py-6">
        <div className="w-full">
          <ImageDropzone
            initialUrl={initial?.photoUrl}
            onChange={(f) => setFile(f)}
            accept="image/png, image/jpeg"
            aspect="1/1"
            labelIdle="Klik atau drag foto profil ke sini"
            className="max-h-[260px]"
          />
        </div>

        <div className="w-full space-y-3">
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
      </div>
    </Modal>
  );
}
