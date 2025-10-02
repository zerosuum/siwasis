// src/app/(admin)/layout.jsx
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[200px] shrink-0 border-r border-[#E0E4D7] bg-[#6E8649] text-white flex flex-col justify-between p-4">
        <div>
          <div className="mb-6 text-2xl font-semibold">SiWASIS</div>
          <nav className="flex flex-col gap-1 text-[15px]">
            <Link
              className="rounded-md px-3 py-2 hover:bg-white/10"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="rounded-md px-3 py-2 hover:bg-white/10"
              href="/kas"
            >
              Kas
            </Link>
            <Link
              className="rounded-md px-3 py-2 hover:bg-white/10"
              href="/arisan"
            >
              Arisan
            </Link>
            <Link
              className="rounded-md px-3 py-2 hover:bg-white/10"
              href="/jimpitan"
            >
              Jimpitan
            </Link>
            <Link
              className="rounded-md px-3 py-2 hover:bg-white/10"
              href="/sampah"
            >
              Sampah
            </Link>
            <Link
              className="rounded-md px-3 py-2 hover:bg-white/10"
              href="/dokumen"
            >
              Dokumen
            </Link>
            <Link
              className="rounded-md px-3 py-2 hover:bg-white/10"
              href="/tambah-warga"
            >
              Tambah Warga
            </Link>
          </nav>
        </div>
        <div className="pt-4 border-t border-white/20">
          <Link
            className="rounded-md px-3 py-2 hover:bg-white/10"
            href="/settings"
          >
            Settings
          </Link>
        </div>
      </aside>

      {/* Area konten */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#EEF0E8] bg-white px-6">
          <Breadcrumbs />
          <div className="text-sm text-gray-600">Username</div>
        </header>

        {/* Body */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
