"use client";
import * as React from "react";
import { CheckCircle2 as IconSuccess } from "lucide-react";

export default function ConfirmDialog({
  open,
  title,
  description,
  cancelText = "Batal",
  okText = "Ya, Simpan",
  onCancel,
  onOk,
  hideCancel = false,
  variant = "default",
  autoCloseMs,
}) {
  React.useEffect(() => {
    if (!open || !autoCloseMs) return;
    const t = setTimeout(() => onOk?.(), autoCloseMs);
    return () => clearTimeout(t);
  }, [open, autoCloseMs, onOk]);

  if (!open) return null;

  const isSuccess = variant === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 sm:px-0">
      <div
        className={[
          "w-full max-w-[460px] rounded-2xl bg-white p-4 sm:p-6 shadow-2xl",
          isSuccess ? "border border-[#CFE2C5]" : "",
          "max-h-[90vh] overflow-y-auto",
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          {isSuccess && (
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF4E4]">
              <IconSuccess className="text-[#6E8649]" size={22} />
            </span>
          )}
          <div className="min-w-0">
            <div className="text-base sm:text-lg font-semibold">{title}</div>
            {description && (
              <div className="mt-1 text-sm text-gray-600">{description}</div>
            )}
          </div>
        </div>

        <div
          className={[
            "mt-4 flex gap-2",
            hideCancel
              ? "justify-end flex-col sm:flex-row"
              : "flex-col-reverse sm:flex-row sm:justify-end",
          ].join(" ")}
        >
          {!hideCancel && (
            <button
              onClick={onCancel}
              className="w-full sm:w-auto rounded-md border px-3 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onOk}
            className={[
              "w-full sm:w-auto rounded-md px-3 py-2 text-sm text-white",
              isSuccess
                ? "bg-[#6E8649] hover:bg-[#5a7340]"
                : "bg-[#334a2a] hover:bg-[#2a3c22]",
            ].join(" ")}
          >
            {okText}
          </button>
        </div>
      </div>
    </div>
  );
}
