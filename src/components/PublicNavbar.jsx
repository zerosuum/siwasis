"use client"; // Navbar publik adalah client component

import Link from "next/link";

export default function PublicNavbar({ profile }) {
  const isLoggedIn = !!profile;

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      <Link href="/" className="font-bold text-xl text-[#46552D]">
        SiWASIS
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/">Beranda</Link>
        <Link href="/blog">Berita</Link>
        <Link href="/dokumentasi-video">Video</Link>

        {/* Link Transparansi selalu ke /dashboard */}
        <Link href="/dashboard">Transparansi Keuangan</Link>

        {/* Tombol Login/Logout Dinamis */}
        {isLoggedIn ? (
          <Link href="/api/logout">Logout ({profile.name})</Link> // (Nanti buat /api/logout)
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
