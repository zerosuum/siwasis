"use client";
import * as React from "react";
import { Modal, Button, Input, Label } from "@/components/ui/UI";
import { UploadCloud } from "lucide-react";

export default function EditProfileModal({ open, onClose, onSubmit, initial }) {
  const [name, setName] = React.useState(initial?.name || "");
  const [email, setEmail] = React.useState(initial?.email || "");
  const [file, setFile] = React.useState(null);
  const [preview, setPreview] = React.useState(null);

  React.useEffect(() => {
    if (open) {
      setName(initial?.name || "");
      setEmail(initial?.email || "");
      setFile(null);
      setPreview(null);
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
            disabled={!name || !email}
            onClick={() => onSubmit?.({ name, email, photo: file })}
          >
            Simpan
          </Button>
        </>
      }
    >
      <div className="w-full">
        <label
          htmlFor="file-upload"
          className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover rounded-lg"
            />
          ) : (
            <>
              <UploadCloud className="w-10 h-10 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">
                Klik atau drag file ke sini
              </span>
            </>
          )}
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
          />
        </label>
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
