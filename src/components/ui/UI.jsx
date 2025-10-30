"use client";
import * as React from "react";
import { X as IconX } from "lucide-react";

export function Label({ children, className = "" }) {
  return (
    <label className={`text-sm font-medium text-gray-700 ${className}`}>
      {children}
    </label>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#6E8649] focus:ring-2 focus:ring-[#E2E7D7] ${className}`}
    />
  );
}

export function Button({ variant = "solid", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm transition disabled:opacity-60";
  const styles = {
    solid: "bg-[#6E8649] text-white hover:bg-[#61753f]",
    ghost: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    soft: "bg-[#E2E7D7] text-[#46552D] hover:bg-[#d6dec4]",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  };
  return (
    <button {...props} className={`${base} ${styles[variant]} ${className}`} />
  );
}

export function Modal({ title, open, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 mx-auto mt-20 w-[560px] max-w-[95vw] rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-gray-100"
          >
            <IconX size={18} />
          </button>
        </div>
        <div className="space-y-3">{children}</div>
        {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
