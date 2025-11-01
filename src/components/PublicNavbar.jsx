"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function PublicNavbar({ profile }) {
  const isLoggedIn = !!profile;
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/dashboard")) return null;

  const isHomepage = pathname === "/";

  const navClasses = `
    w-full h-[72px] z-50
    ${
      isHomepage
        ? `fixed top-0 left-0 right-0 transition-transform duration-300 ease-in-out
         ${scrolled ? "-translate-y-full" : "translate-y-0"}
         ${
           !scrolled
             ? "backdrop-blur-md bg-white/10 text-wasis-nt80 border-b border-white/20"
             : ""
         }
        `
        : 
          `sticky top-0 bg-wasis-pr40 text-wasis-nt80 border-b border-white/20`
    }
  `;

  const linkClass = "text-lg font-rem hover:opacity-80";
  const buttonClass = `
    flex h-9 px-4 justify-center items-center gap-1 rounded-lg text-sm font-semibold
    ${
      isHomepage
        ? "bg-wasis-pr60 text-wasis-nt80 hover:bg-wasis-pr60/80"
        : "bg-wasis-pr00 text-wasis-pr80 hover:bg-white/80"
    }
  `;

  return (
    <nav className={navClasses}>
      <div
        className="relative w-full max-w-[1440px] mx-auto h-full px-4
                      flex justify-between items-center"
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-2xl">SiWASIS</span>
        </Link>
        <div className="hidden md:flex items-center gap-4">
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

        <div className="hidden md:flex">
          <Link
            href={isLoggedIn ? "/api/logout" : "/login"}
            className={buttonClass}
          >
            {isLoggedIn ? "Logout" : "Login"}
          </Link>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <div
        className={`absolute top-[72px] left-0 w-full bg-wasis-pr40 shadow-lg p-4
                     flex flex-col gap-4 text-center transition-transform duration-300
                     md:hidden ${
                       isMobileMenuOpen
                         ? "translate-y-0"
                         : "-translate-y-[150%]"
                     }`}
      >
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
        <Link
          href={isLoggedIn ? "/api/logout" : "/login"}
          className={`${buttonClass} w-full`}
        >
          {isLoggedIn ? "Logout" : "Login"}
        </Link>
      </div>
    </nav>
  );
}
