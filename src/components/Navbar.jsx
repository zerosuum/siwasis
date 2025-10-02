"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
 { href: "#hero", label: "Beranda" },
 { href: "#visi", label: "Visi & Misi" },
 { href: "#struktur", label: "Struktur" },
 { href: "#artikel", label: "Artikel" },
 { href: "#video", label: "Video" },
];

export default function Navbar() {
 const [open, setOpen] = useState(false);
 useEffect(() => {
 const onHash = () => setOpen(false);
 window.addEventListener("hashchange", onHash);
 return () => window.removeEventListener("hashchange", onHash);
 }, []);

 return (
 <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
 <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
 <a href="#hero" className="font-bold">
 SiWASIS
 </a>

 <div className="hidden gap-6 md:flex">
 {links.map((l) => (
 <a key={l.href} href={l.href} className="text-sm hover:text-brand">
 {l.label}
 </a>
 ))}
 <a
 href="/login"
 className="rounded-md bg-black px-3 py-2 text-white text-sm"
 >
 Login
 </a>
 </div>

 <button
 className="md:hidden"
 onClick={() => setOpen((v) => !v)}
 aria-label="Toggle menu"
 >
 {open ? <X /> : <Menu />}
 </button>
 </nav>
 {open && (
 <div className="border-t bg-white md:hidden">
 <div className="mx-auto max-w-6xl px-4 py-2 flex flex-col gap-2">
 {links.map((l) => (
 <a key={l.href} href={l.href} className="py-2">
 {l.label}
 </a>
 ))}
 <a
 href="/login"
 className="rounded-md bg-black px-3 py-2 text-white text-sm"
 >
 Login
 </a>
 </div>
 </div>
 )}
 </header>
 );
}
