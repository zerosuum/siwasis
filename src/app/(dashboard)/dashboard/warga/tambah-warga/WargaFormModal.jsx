"use client";
import * as React from "react";

export default function WargaFormModal({
  variant = "WARGA",
  onClose,
  onSubmit,
  initial,
}) {
  const [nama, setNama] = React.useState("");
  const [rt, setRt] = React.useState("");
  const [tanggal_lahir, setTanggalLahir] = React.useState("");
  const [role, setRole] = React.useState("warga");
  const [alamat, setAlamat] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

    React.useEffect(() => {
      if (!initial) return;
      setNama(initial.nama ?? "");
      setRt((initial.rt ?? initial.rt_code ?? "").toString());
      setTanggalLahir(initial.tanggal_lahir?.slice(0, 10) ?? "");
      setRole(initial.role ?? "warga");
      setAlamat(initial.alamat ?? "");
    }, [initial]);

  const title =
    variant === "KAS"
      ? "Tambah Anggota Kas"
      : variant === "ARISAN"
      ? "Tambah Anggota Arisan"
      : "Tambah Warga";

  async function handleSubmit() {
    const rt2 = (rt || "").padStart(2, "0");
    if (!nama || !rt2 || !tanggal_lahir || !alamat ) return;

    setSubmitting(true);
    try {
      await onSubmit({
        nama,
        rt: rt2,
        tanggal_lahir,
        role: role || "warga",
        alamat,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[560px] max-w-[95vw] rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        {variant !== "WARGA" && (
          <p className="mb-3 text-xs text-gray-500">
            Setelah disimpan, warga akan otomatis ditandai sebagai anggota{" "}
            {variant.toLowerCase()}.
          </p>
        )}

        <div className="grid gap-3">
          <div>
            <label className="mb-1 block text-sm">Nama *</label>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              placeholder="Nama lengkap"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm">RT *</label>
              <input
                value={rt}
                onChange={(e) =>
                  setRt(e.target.value.replace(/\D/g, "").slice(0, 2))
                }
                placeholder="01"
                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Tanggal Lahir *</label>
              <input
                type="date"
                value={tanggal_lahir}
                onChange={(e) => setTanggalLahir(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                inputMode="numeric"
                placeholder="YYYY-MM-DD"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            >
              <option value="warga">Warga</option>
              <option value="ketua">Ketua</option>
              <option value="wakil_ketua">Wakil Ketua</option>
              <option value="sekretaris">Sekretaris</option>
              <option value="bendahara">Bendahara</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm">Alamat *</label>
            <input
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              placeholder="Alamat domisili"
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
            disabled={
              !nama ||
              !rt ||
              !tanggal_lahir ||
              !alamat ||
              submitting
            }
            onClick={handleSubmit}
            className="rounded-lg bg-[#6E8649] px-4 py-1.5 text-sm text-white disabled:opacity-60"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
