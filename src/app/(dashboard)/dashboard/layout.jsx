"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  LayoutDashboard as IconDashboard,
  Wallet as IconKas,
  Handshake as IconArisan,
  Home as IconJimpitan,
  Trash2 as IconSampah,
  Folder as IconDokumen,
  UserPlus as IconTambahWarga,
  Settings as IconSettings,
  ArrowLeft as IconKembali,
} from "lucide-react";

function SidebarLink({ href, icon: Icon, children, exact = false }) {
  const pathname = usePathname();

  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors duration-150 ${
        isActive ? "bg-white font-semibold text-[#46552D]" : "hover:bg-white/10"
      }`}
    >
      <Icon size={20} />
      <span>{children}</span>
    </Link>
  );
}

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className="flex w-[220px] shrink-0 flex-col justify-between border-r bg-[#6E8649] p-4 text-white">
        <div>
          <div className="mb-8 text-center text-3xl font-bold tracking-wider">
            SiWASIS
          </div>
          <nav className="flex flex-col gap-2 text-[15px]">
            <SidebarLink href="/dashboard" icon={IconDashboard} exact={true}>
              Dashboard
            </SidebarLink>
            <SidebarLink href="/dashboard/kas" icon={IconKas}>
              Kas
            </SidebarLink>
            <SidebarLink href="/dashboard/arisan" icon={IconArisan}>
              Arisan
            </SidebarLink>
            <SidebarLink href="/dashboard/jimpitan" icon={IconJimpitan}>
              Jimpitan
            </SidebarLink>
            <SidebarLink href="/dashboard/sampah" icon={IconSampah}>
              Sampah
            </SidebarLink>
            <SidebarLink href="/dashboard/dokumen" icon={IconDokumen}>
              Dokumen
            </SidebarLink>
            <SidebarLink href="/dashboard/tambah-warga" icon={IconTambahWarga}>
              Tambah Warga
            </SidebarLink>
          </nav>
        </div>
        <div className="space-y-2 border-t border-white/20 pt-4">
          <SidebarLink href="/dashboard/settings" icon={IconSettings}>
            Settings
          </SidebarLink>
          <SidebarLink href="/kembali" icon={IconKembali}>
            Kembali
          </SidebarLink>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="sticky top-0 z-30 grid h-[72px] grid-cols-[1fr_auto] items-center gap-4 border-b border-[#EEF0E8] bg-white px-6">
          <div className="min-w-0 text-sm font-medium text-gray-500">
            <Breadcrumbs />
          </div>
          <div className="text-sm text-gray-600">Username</div>
        </header>

        <main className="bg-white overflow-auto min-h-[calc(100vh-72px)]">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
