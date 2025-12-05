"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
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
  User as IconUser,
  Menu as IconMenu,
  X as IconX,
} from "lucide-react";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";
import Image from "next/image";
import { getProfilePhotoUrl } from "@/lib/profilePhoto";

function Avatar({ seed }) {
  const svg = createAvatar(lorelei, {
    seed: seed || "SiWASIS User",
  }).toDataUri();

  return (
    <Image
      src={svg}
      alt="Avatar"
      width={32}
      height={32}
      className="h-full w-full object-cover"
      unoptimized
    />
  );
}

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

// const getStorageUrl = (filename) => {
//   if (!filename) return null;

//   const baseUrl = process.env.NEXT_PUBLIC_API_BASE
//     ? process.env.NEXT_PUBLIC_API_BASE.replace("/api", "")
//     : "https://siwasis.novarentech.web.id";

//   return `${baseUrl}/storage/profile/${filename}`;
// };

export default function DashboardShell({ profile, children }) {
  const isLoggedIn = !!profile;
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const photoUrl = useMemo(() => getProfilePhotoUrl(profile), [profile]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[220px] shrink-0 flex-col justify-between 
          border-r bg-[#6E8649] p-4 text-white
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div>
          <div className="mb-8">
            <div className="flex justify-end lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="-mr-1 -mt-1 p-1"
                aria-label="Tutup menu"
              >
                <IconX size={24} className="text-white" />
              </button>
            </div>

            <div className="text-center">
              <span className="text-3xl font-bold tracking-wider">SiWASIS</span>
              <p className="font-rem text-xs font-normal text-[#E0E4D7] leading-[18px]">
                Powered by Novaren Tech
              </p>
            </div>
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
            {isLoggedIn && (
              <>
                <SidebarLink href="/dashboard/warga" icon={IconTambahWarga}>
                  Tambah Warga
                </SidebarLink>
              </>
            )}
          </nav>
        </div>
        <div className="space-y-2 border-t border-white/20 pt-4">
          {isLoggedIn && (
            <SidebarLink href="/dashboard/settings" icon={IconSettings}>
              Settings
            </SidebarLink>
          )}
          <SidebarLink href="/" icon={IconKembali} exact={true}>
            Kembali
          </SidebarLink>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:ml-[220px]">
        {/* <header className="sticky top-0 z-30 flex h-[72px] items-center gap-4 border-b border-[#EEF0E8] bg-white px-6"> */}
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-[#EEF0E8] bg-white px-6 py-3 min-h-[72px]">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden"
            aria-label="Buka menu"
          >
            <IconMenu size={28} className="text-gray-700" />
          </button>

          <div className="min-w-0 text-sm font-medium text-gray-500">
            <Breadcrumbs />
          </div>

          <div className="flex-grow" />

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={profile?.name || "avatar"}
                  className="h-full w-full object-cover"
                />
              ) : profile ? (
                <Avatar seed={profile.name} />
              ) : (
                <IconUser size={18} className="text-gray-500" />
              )}
            </div>

            <div className="text-sm text-gray-600 hidden md:block">
              {profile ? profile.name : "Warga"}
            </div>
          </div>
        </header>

        <main className="bg-white overflow-auto min-h-[calc(100vh-72px)]">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
