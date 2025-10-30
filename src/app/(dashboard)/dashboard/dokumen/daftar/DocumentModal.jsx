"use client";
import * as React from "react";

export default function DocumentModal({
  open,
  onClose,
  initial,
  onCreate,
  onUpdate,
}) {
  const isEdit = !!initial;

  const BE_ORIGIN = React.useMemo(() => {
    try {
      const raw = process.env.NEXT_PUBLIC_API_BASE || "/api";
      return new URL(raw).origin;
    } catch {
      return "http://127.0.0.1:8000";
    }
  }, []);
  const publicFileURL = React.useCallback(
    (file_path) =>
      `${BE_ORIGIN}/storage/${(file_path || "")
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`,
    [BE_ORIGIN]
  );

  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [description, setDescription] = React.useState(
    initial?.description ?? ""
  );
  const [file, setFile] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      setDescription(initial?.description ?? "");
      setFile(null);
    }
  }, [open, initial]);

  React.useEffect(() => {
    if (open) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  const submit = async () => {
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("title", title);
      if (description) form.append("description", description);
      if (file) form.append("file_path", file);
      const today = new Date();
      const uploadedAt = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 10);
      form.append("uploaded_at", uploadedAt);
      if (isEdit) await onUpdate?.(initial.id, form);
      else await onCreate?.(form);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[560px] max-w-[95vw] rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold">
          {isEdit ? "Edit Dokumen" : "Mengunggah Dokumen"}
        </h3>

        <div className="grid gap-3">
          <div>
            <label className="mb-1 block text-sm">File</label>

            {isEdit && initial?.file_path && (
              <div className="mb-2 text-sm">
                <span className="text-gray-500 mr-1">Saat ini:</span>
                <a
                  href={publicFileURL(initial.file_path)}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-[#6E8649]"
                >
                  {initial.title}
                </a>
              </div>
            )}

            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            />
            {!isEdit && (
              <p className="mt-1 text-xs text-gray-500">Wajib saat membuat.</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm">Nama *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="RAB 2025"
              className="block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Keterangan (opsional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-4 py-1.5 text-sm"
          >
            Batal
          </button>
          <button
            onClick={submit}
            disabled={submitting || !title || (!isEdit && !file)}
            className="rounded-lg bg-[#6E8649] px-4 py-1.5 text-sm text-white disabled:opacity-60"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
