"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const schema = z.object({
 tanggal: z.string().min(1, "Pilih tanggal"),
 keterangan: z.string().min(3, "Minimal 3 karakter"),
 tipe: z.enum(["pemasukan", "pengeluaran"]),
 nominal: z.coerce.number().min(1000, "Minimal Rp1.000"),
});

export default function KasForm({ mode = "create", id, defaults, onSuccess }) {
 const router = useRouter();
 const {
 register,
 handleSubmit,
 formState: { errors, isSubmitting },
 reset,
 } = useForm({
 resolver: zodResolver(schema),
 defaultValues: defaults || {
 tanggal: "",
 keterangan: "",
 tipe: "pemasukan",
 nominal: 0,
 },
 });

 const onSubmit = async (data) => {
 const url = mode === "edit" ? `/api/mock/kas/${id}` : "/api/mock/kas";
 const method = mode === "edit" ? "PUT" : "POST";
 await fetch(url, {
 method,
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(data),
 });
 reset();
 onSuccess?.();
 router.refresh();
 };

 return (
 <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
 <div>
 <label className="block text-sm mb-1">Tanggal</label>
 <input
 type="date"
 {...register("tanggal")}
 className="w-full rounded-md border px-3 py-2 text-sm"
 />
 {errors.tanggal && (
 <p className="text-sm text-rose-600">{errors.tanggal.message}</p>
 )}
 </div>

 <div>
 <label className="block text-sm mb-1">Keterangan</label>
 <input
 {...register("keterangan")}
 className="w-full rounded-md border px-3 py-2 text-sm"
 placeholder="mis. Iuran Mingguan"
 />
 {errors.keterangan && (
 <p className="text-sm text-rose-600">{errors.keterangan.message}</p>
 )}
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-sm mb-1">Tipe</label>
 <select
 {...register("tipe")}
 className="w-full rounded-md border px-3 py-2 text-sm"
 >
 <option value="pemasukan">Pemasukan</option>
 <option value="pengeluaran">Pengeluaran</option>
 </select>
 </div>
 <div>
 <label className="block text-sm mb-1">Nominal</label>
 <input
 type="number"
 {...register("nominal")}
 className="w-full rounded-md border px-3 py-2 text-sm"
 placeholder="150000"
 />
 {errors.nominal && (
 <p className="text-sm text-rose-600">{errors.nominal.message}</p>
 )}
 </div>
 </div>

 <div className="flex items-center justify-end gap-2 pt-2">
 <button
 disabled={isSubmitting}
 className="rounded-md bg-black px-4 py-2 text-white"
 >
 {isSubmitting
 ? "Menyimpan…"
 : mode === "edit"
 ? "Simpan Perubahan"
 : "Simpan"}
 </button>
 </div>
 </form>
 );
}
