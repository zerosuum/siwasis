import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-500/30 dark:focus-visible:ring-offset-gray-950";

export const focusInput =
  "focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:border-blue-500";

export const hasErrorInput =
  "aria-invalid:ring-2 aria-invalid:ring-red-200 aria-invalid:border-red-500";

export const first = (v: any) => (Array.isArray(v) ? v[0] : v);

export default { cx, focusRing, focusInput, hasErrorInput, first };
