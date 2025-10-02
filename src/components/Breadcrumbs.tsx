"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  kas: "Kas",
  rekapitulasi: "Rekapitulasi",
  laporan: "Laporan Keuangan",
  arisan: "Arisan",
  jimpitan: "Jimpitan",
  sampah: "Sampah",
  dokumen: "Dokumen",
};

export default function Breadcrumbs() {
  const pathname = usePathname(); // e.g. /kas/rekapitulasi
  const segments = pathname.split("/").filter(Boolean);

  // prefix “Dashboard” sebagai root
  const items = ["dashboard", ...segments];

  return (
    <nav className="text-sm text-gray-600">
      {items.map((seg, i) => {
        const href = "/" + items.slice(1, i + 1).join("/");
        const label = LABELS[seg] ?? seg[0]?.toUpperCase() + seg.slice(1);
        const isLast = i === items.length - 1;

        return (
          <span key={i}>
            {i > 0 && <span className="mx-2 text-gray-300">›</span>}
            {isLast ? (
              <span className="font-medium text-gray-700">{label}</span>
            ) : (
              <Link
                href={i === 0 ? "/dashboard" : href}
                className="hover:underline"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
