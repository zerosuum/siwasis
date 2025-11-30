"use client";
import * as React from "react";
import { Pencil as IconPencil, ChevronDown } from "lucide-react";
import { DatePicker } from "@/components/DatePicker";

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

function parseYMD(dateString) {
  if (!dateString) return undefined;
  const parts = dateString.split("-");
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function toYMD(date) {
  if (!date) return "";
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

const ROLE_OPTIONS = [
  { value: "warga", label: "Warga" },
  { value: "ketua", label: "Ketua" },
  { value: "wakil_ketua", label: "Wakil Ketua" },
  { value: "sekretaris", label: "Sekretaris" },
  { value: "bendahara", label: "Bendahara" },
];

export default function WargaFormModal({
  variant = "WARGA",
  onClose,
  onSubmit,
  initial,
}) {
  const [nama, setNama] = React.useState("");
  const [rt, setRt] = React.useState("");
  const [tanggal, setTanggal] = React.useState(undefined);
  const [role, setRole] = React.useState("warga");
  const [alamat, setAlamat] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const [roleOpen, setRoleOpen] = React.useState(false);
  const roleRef = React.useRef(null);

  React.useEffect(() => {
    if (!initial) return;
    setNama(initial.nama ?? "");
    setRt((initial.rt ?? initial.rt_code ?? "").toString());
    setTanggal(
      initial.tanggal_lahir
        ? parseYMD(initial.tanggal_lahir.slice(0, 10))
        : undefined
    );
    setRole(initial.role ?? "warga");
    setAlamat(initial.alamat ?? "");
  }, [initial]);

  React.useEffect(() => {
    if (!roleOpen) return;
    function handleClickOutside(e) {
      if (!roleRef.current) return;
      if (!roleRef.current.contains(e.target)) {
        setRoleOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [roleOpen]);

  const title =
    variant === "KAS"
      ? "Tambah Anggota Kas"
      : variant === "ARISAN"
      ? "Tambah Anggota Arisan"
      : "Tambah Warga";

  async function handleSubmit() {
    const rt2 = (rt || "").padStart(2, "0");
    if (!nama || !rt2 || !tanggal || !alamat) return;

    setSubmitting(true);
    try {
      await onSubmit({
        nama,
        rt: rt2,
        tanggal_lahir: toYMD(tanggal),
        role: role || "warga",
        alamat,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  const disabled = !nama || !rt || !tanggal || !alamat || submitting;
  const roleLabel =
    ROLE_OPTIONS.find((opt) => opt.value === role)?.label || "Pilih role";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-[460px] rounded-2xl bg-white px-6 py-8 md:px-10 md:py-10 shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="animate-[zoomIn_0.2s_ease-out] mb-4 flex items-center gap-3">
          <IconPencil size={20} className="text-gray-800" />
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>

        {variant !== "WARGA" && (
          <p className="mb-5 text-xs text-gray-500">
            Setelah disimpan, warga akan otomatis ditandai sebagai anggota{" "}
            {variant.toLowerCase()}.
          </p>
        )}

        {/* Form */}
        <div className="space-y-4">
          <FormField label="Nama *">
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
              placeholder="Masukkan nama lengkap"
              autoFocus
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="RT *">
              <input
                value={rt}
                onChange={(e) =>
                  setRt(e.target.value.replace(/\D/g, "").slice(0, 2))
                }
                placeholder="01"
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
              />
            </FormField>

            <FormField label="Tanggal Lahir *">
              <DatePicker
                value={tanggal}
                onChange={setTanggal}
                placeholder="Pilih tanggal"
                className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
                align="center"
                sideOffset={8}
                contentClassName="mt-2 rounded-xl border bg-white p-4 shadow-lg 
                                  min-w-[300px] sm:min-w-[auto]
                                  [&>div>div:last-child]:hidden sm:[&>div>div:last-child]:block"
              />
            </FormField>
          </div>

          {/* Role dropdown custom */}
          <FormField label="Role">
            <div className="relative" ref={roleRef}>
              <button
                type="button"
                onClick={() => setRoleOpen((v) => !v)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
              >
                <span>{roleLabel}</span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {roleOpen && (
                <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                  {ROLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setRole(opt.value);
                        setRoleOpen(false);
                      }}
                      className={`flex w-full items-center px-3 py-2 text-left text-sm hover:bg-[#F4F6EE] ${
                        opt.value === role
                          ? "text-[#6E8649] font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </FormField>

          <FormField label="Alamat *">
            <input
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-0"
              placeholder="Alamat domisili"
            />
          </FormField>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Batal
          </button>
          <button
            disabled={disabled}
            onClick={handleSubmit}
            className="rounded-lg bg-[#6E8649] px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
