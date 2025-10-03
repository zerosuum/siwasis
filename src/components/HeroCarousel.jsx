"use client";
import useEmblaCarousel from "embla-carousel-react";

export default function HeroCarousel() {
 const [emblaRef] = useEmblaCarousel({
 loop: true,
 align: "start",
 dragFree: true,
 });

 const slides = [
 {
 id: 1,
 title: "Transparansi Keuangan Desa",
 text: "Kas, arisan, jimpitan, sampah dalam satu sistem.",
 },
 {
 id: 2,
 title: "Laporan Publik",
 text: "Warga bisa cek laporan yang dipublikasikan.",
 },
 {
 id: 3,
 title: "Admin Mudah Input",
 text: "Form modal cepat, filter bulan & pagination.",
 },
 ];

 return (
 <section id="hero" className="relative border-b">
 <div className="mx-auto max-w-6xl px-4 py-12">
 <div className="overflow-hidden" ref={emblaRef}>
 <div className="flex">
 {slides.map((s) => (
 <div
 key={s.id}
 className="min-w-0 shrink-0 grow-0 basis-full md:basis-1/2 lg:basis-1/3 p-2"
 >
 <div className="h-48 rounded-2xl bg-gradient-to-br from-brand/15 to-neutral-100 p-6 flex flex-col justify-end">
 <h3 className="text-xl font-semibold">{s.title}</h3>
 <p className="text-sm opacity-80">{s.text}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>
 );
}
