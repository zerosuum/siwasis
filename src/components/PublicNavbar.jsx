"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PublicNavbar({ profile }) {
  const isLoggedIn = !!profile;
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/dashboard")) return null;

const navClasses = `
  fixed top-0 left-0 right-0 z-50 h-[72px]
  transition-transform duration-300 ease-in-out
  ${
    scrolled
      ? "-translate-y-full"
      : "translate-y-0 bg-white/10 text-wasis-nt80 backdrop-blur-md border-b border-white/20"
  }
`;

  const linkClass = "text-lg font-rem hover:opacity-80";
  const buttonClass = `
    flex h-9 px-4 justify-center items-center gap-1 rounded-lg text-sm font-semibold
    bg-wasis-pr60 text-wasis-nt80 hover:bg-wasis-pr60/80
  `;

  return (
    <nav className={navClasses}>
      <div className="relative w-full max-w-[1440px] mx-auto h-full px-4">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Link href="/" className="flex items-center gap-2 p-3">
            <span className="font-bold text-2xl">SiWASIS</span>
          </Link>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center gap-4 p-3">
            <Link href="/" className={linkClass}>
              Beranda
            </Link>
            <Link href="/blog" className={linkClass}>
              Berita
            </Link>
            <Link href="/dokumentasi-video" className={linkClass}>
              Dokumentasi Video
            </Link>
            <Link href="/dashboard" className={linkClass}>
              Transparansi Keuangan
            </Link>
          </div>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Link
            href={isLoggedIn ? "/api/logout" : "/login"}
            className={buttonClass}
          >
            {isLoggedIn ? "Logout" : "Login"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
