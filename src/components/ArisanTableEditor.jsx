"use client";

import { useMemo, useState } from "react";
import Button from "@/components/Button";
import { cls } from "@/lib/format";

export default function ArisanTableEditor({ rows, weeks, onSaved }) {
 // bikin salinan editable
 const [edit, setEdit] = useState(false);
 const [draft, setDraft] = useState(() =>
 rows.map((r) => ({ ...r, minggu: { ...(r.minggu || {}) } }))
 );
 const changed = useMemo(
 () => JSON.stringify(draft) !== JSON.stringify(rows),
 [draft, rows]
 );

 const toggleCell = (rowIdx, weekKey) => {
 setDraft((d) =>
 d.map((r, i) =>
 i === rowIdx
 ? { ...r, minggu: { ...r.minggu, [weekKey]: !r.minggu?.[weekKey] } }
 : r
 )
 );
 };

 const onCancel = () => {
 setDraft(rows.map((r) => ({ ...r, minggu: { ...(r.minggu || {}) } })));
 setEdit(false);
 };

 const onSave = async () => {
 // kirim hanya yang berubah (simple: kirim full draft)
 const res = await fetch("/api/mock/arisan/bulk", {
 method: "PUT",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ rows: draft }),
 });
 if (res.ok) {
 setEdit(false);
 onSaved?.();
 }
 };

 return (
 <div className="space-y-3">
 <div className="flex justify-end gap-2">
 {!edit ? (
 <Button variant="outline" onClick={() => setEdit(true)}>
 Edit
 </Button>
 ) : (
 <>
 <Button variant="ghost" onClick={onCancel}>
 Batal
 </Button>
 <Button variant="solid" onClick={onSave} disabled={!changed}>
 Simpan
 </Button>
 </>
 )}
 </div>

 <div className="overflow-auto rounded-2xl border bg-white shadow-sm">
 <table className="min-w-full text-sm">
 <thead className="sticky top-0 z-10 bg-neutral-50 text-neutral-600">
 <tr className="[&_th]:px-4 [&&_th]:py-3 [&&_th]:font-medium">
 <th className="w-0 text-left">No</th>
 <th className="text-left">Nama</th>
 {weeks.map((w) => (
 <th key={w.key} className="text-center whitespace-nowrap">
 {w.label}
 </th>
 ))}
 <th className="w-0"></th>
 </tr>
 </thead>
 <tbody className="[&>tr:nth-child(even)]:bg-neutral-50/40">
 {draft.map((r, i) => (
 <tr key={r.id} className="[&_td]:px-4 [&&_td]:py-3">
 <td className="text-neutral-500">{i + 1}</td>
 <td className="min-w-[160px]">{r.nama}</td>
 {weeks.map((w) => (
 <td key={w.key} className="text-center">
 {edit ? (
 <input
 type="checkbox"
 checked={!!r.minggu?.[w.key]}
 onChange={() => toggleCell(i, w.key)}
 className="size-4 align-middle accent-brand"
 />
 ) : (
 <span
 className={cls(
 "inline-block size-2 rounded-full align-middle",
 r.minggu?.[w.key]
 ? "bg-emerald-500"
 : "bg-neutral-300"
 )}
 />
 )}
 </td>
 ))}
 <td />
 </tr>
 ))}
 {draft.length === 0 && (
 <tr>
 <td
 colSpan={weeks.length + 3}
 className="px-4 py-10 text-center text-neutral-500"
 >
 Tidak ada data
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 );
}
