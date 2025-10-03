"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Users,
  HandCoins,
  Recycle,
  FileText,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Beranda" },
  { href: "/dashboard/kas", icon: Wallet, label: "Kas" },
  { href: "/dashboard/arisan", icon: Users, label: "Arisan" },
  { href: "/dashboard/jimpitan", icon: HandCoins, label: "Jimpitan" },
  { href: "/dashboard/sampah", icon: Recycle, label: "Sampah" },
  { href: "/dashboard/dokumen", icon: FileText, label: "Dokumen" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar({ onLogout }) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className={`shrink-0 border-r bg-white ${
        open ? "w-60" : "w-16"
      } transition-all`}
    >
      <div className="flex items-center justify-between px-3 py-3">
        <button aria-label="toggle sidebar" onClick={() => setOpen((v) => !v)}>
          <Menu />
        </button>
        {open && <span className="font-semibold">SiWASIS</span>}
        <span className="w-6" />
      </div>

      <nav className="px-2 pb-2">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-neutral-100 ${
                active
                  ? "bg-neutral-100 font-medium border-l-4 border-brand pl-2"
                  : ""
              }`}
            >
              <Icon className="size-4" />
              {open && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* tombol logout: pakai server action yang dipass dari layout */}
      <form action={onLogout} className="mt-auto px-2 pb-3">
        <button
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-neutral-100"
          type="submit"
        >
          <LogOut className="size-4" />
          {open && <span>Keluar</span>}
        </button>
      </form>
    </aside>
  );
}
