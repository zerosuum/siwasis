"use client";
export default function ConfirmDialog({
 open,
 title,
 description,
 cancelText = "Batal",
 okText = "Ya, Simpan",
 onCancel,
 onOk,
}) {
 if (!open) return null;
 return (
 <div className="fixed inset-0 z-50 grid place-items-center bg-black/30">
 <div className="w-[460px] rounded-xl bg-white p-6 shadow-2xl">
 <div className="text-lg font-semibold">{title}</div>
 <div className="mt-2 text-sm text-gray-600">{description}</div>
 <div className="mt-4 flex justify-end gap-2">
 <button
 onClick={onCancel}
 className="rounded-md border px-3 py-2 text-sm"
 >
 {cancelText}
 </button>
 <button
 onClick={onOk}
 className="rounded-md bg-[#334a2a] px-3 py-2 text-sm text-white"
 >
 {okText}
 </button>
 </div>
 </div>
 </div>
 );
}
