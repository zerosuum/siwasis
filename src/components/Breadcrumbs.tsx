"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS = {
  dashboard: "Dashboard",
  warga: "Warga",
  "tambah-warga": "Tambah Warga",
  kas: "Kas",
  rekapitulasi: "Rekapitulasi",
  laporan: "Laporan Keuangan",
  arisan: "Arisan",
  jimpitan: "Jimpitan",
  sampah: "Sampah",
  dokumen: "Dokumen",
};

const titleCase = (s="") =>
  s.split("-").map(w => w ? w[0].toUpperCase() + w.slice(1) : w).join(" ");

export default function Breadcrumbs() {
  const pathname = usePathname();
  const raw = pathname.split("/").filter(Boolean);

  const base = raw[0] === "dashboard" ? raw : ["dashboard", ...raw];


  const segments = base.filter((seg, i, arr) => i === 0 || seg !== arr[i - 1]);

  return (
    <nav className="text-sm text-gray-600">
      {segments.map((seg, i) => {
        const label = LABELS[seg] ?? titleCase(seg);
        const isLast = i === segments.length - 1;
        const href = "/" + segments.slice(0, i + 1).join("/");

        return (
          <span key={href}>
            {i > 0 && <span className="mx-2 text-gray-300">›</span>}
            {isLast ? (
              <span className="font-medium text-gray-700">{label}</span>
            ) : (
              <Link href={href} className="hover:underline">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
