// src/lib/utils.ts
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** gabung className dengan aman (clsx + tailwind-merge) */
export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** ring fokus seragam untuk komponen (string, bukan function) */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-white " +
  "dark:focus-visible:ring-blue-500/30 dark:focus-visible:ring-offset-gray-950";

/** (opsional) dipakai komponen lain */
export const focusInput =
  "focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:border-blue-500";
export const hasErrorInput =
  "aria-invalid:ring-2 aria-invalid:ring-red-200 aria-invalid:border-red-500";
