"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Loader2 } from "lucide-react";

import LoginModal from "@/components/LoginModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function PublicNavbar({ profile }) {
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [forcedRole, setForcedRole] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setIsMobileMenuOpen(false), [pathname]);

  useEffect(() => {
    const openLogin = () => setLoginModalOpen(true);
    const openLogout = () => setLogoutConfirmOpen(true);
    document.addEventListener("OPEN_LOGIN", openLogin);
    document.addEventListener("OPEN_LOGOUT_CONFIRM", openLogout);
    return () => {
      document.removeEventListener("OPEN_LOGIN", openLogin);
      document.removeEventListener("OPEN_LOGOUT_CONFIRM", openLogout);
    };
  }, []);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const as = sp.get("as");
    const open = sp.get("open");
    if (as === "guest" || as === "admin") setForcedRole(as);
    if (open === "login") setLoginModalOpen(true);
    if (open === "logout") setLogoutConfirmOpen(true);
  }, []);

  const isLoggedIn =
    forcedRole === "admin"
      ? true
      : forcedRole === "guest"
      ? false
      : !!(profile && (profile.is_admin || profile.id));

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
           }`
        : `sticky top-0 bg-wasis-pr40 text-wasis-nt80 border-b border-white/20`
    }
  `;

  const buttonClass = `
    flex h-9 px-4 justify-center items-center gap-1 rounded-lg text-sm font-semibold
    ${
      isHomepage
        ? "bg-wasis-pr60 text-wasis-nt80 hover:bg-wasis-pr60/80"
        : "bg-wasis-pr00 text-wasis-pr80 hover:bg-white/80"
    }
  `;

  const baseLinkStyle = `
    flex h-9 items-center justify-center px-4 rounded-full
    relative overflow-hidden 
    text-lg font-rem font-medium 
    transition-colors duration-200 ease-in-out
  `;

  const inactiveLinkClass = `
    ${baseLinkStyle}
    text-wasis-nt80/90 
    bg-transparent 
    hover:bg-white/10 hover:text-wasis-pr00
  `;

  const activeLinkClass = `
    ${baseLinkStyle}
    text-wasis-pr00 
    bg-white/20
  `;

  function NavLink({ href, children }) {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={isActive ? activeLinkClass : inactiveLinkClass}
      >
        {isActive && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 
                       h-[50%] bg-gradient-to-b from-white/35 to-transparent"
          />
        )}

        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/session/logout", { method: "POST" });
      router.refresh();
    } catch {
      alert("Gagal logout.");
    } finally {
      setIsLoggingOut(false);
      setLogoutConfirmOpen(false);
    }
  };

  return (
    <>
      <nav className={navClasses}>
        <div className="relative w-full max-w-[1440px] mx-auto h-full px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 p-3">
            <span className="font-bold text-2xl">SiWASIS</span>
          </Link>

          <div className="hidden md:flex items-center gap-2 p-3">
            <NavLink href="/">Beranda</NavLink>
            <NavLink href="/blog">Berita</NavLink>
            <NavLink href="/dokumentasi-video">Video</NavLink>
            <NavLink href="/dashboard">Keuangan</NavLink>
          </div>

          <div className="hidden md:flex">
            {isLoggedIn ? (
              <button
                onClick={() => setLogoutConfirmOpen(true)}
                className={buttonClass}
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className={buttonClass}
              >
                Login
              </button>
            )}
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
          className={`absolute top-[72px] left-0 w-full bg-wasis-pr40 shadow-lg p-4 flex flex-col gap-4 text-center transition-transform duration-300 md:hidden ${
            isMobileMenuOpen ? "translate-y-0" : "-translate-y-[150%]"
          }`}
        >
          <NavLink href="/">Beranda</NavLink>
          <NavLink href="/blog">Berita</NavLink>
          <NavLink href="/dokumentasi-video">Video</NavLink>
          <NavLink href="/dashboard">Keuangan</NavLink>

          {isLoggedIn ? (
            <button
              onClick={() => setLogoutConfirmOpen(true)}
              className={`${buttonClass} w-full`}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => setLoginModalOpen(true)}
              className={`${buttonClass} w-full`}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      <ConfirmDialog
        open={isLogoutConfirmOpen}
        onCancel={() => setLogoutConfirmOpen(false)}
        onOk={handleLogout}
        title="Konfirmasi Logout"
        description="Apakah Anda yakin ingin keluar?"
        okText={
          isLoggingOut ? <Loader2 className="animate-spin" /> : "Ya, Logout"
        }
      />
    </>
  );
}
