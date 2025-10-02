import SpinningClient from "./spin-client";
import { absoluteUrl } from "@/lib/absolute-url";

export const revalidate = 0;

export default async function ArisanSpinPage() {
 // Ambil peserta yang BELUM dapat
 let peserta = [];
 try {
 const res = await fetch(
 await absoluteUrl("/api/mock/arisan?only=belum&limit=1000"),
 {
 cache: "no-store",
 }
 );
 if (res.ok) {
 const json = await res.json();
 // normalisasi -> { id, label, color }
 peserta =
 (json?.rows ?? [])
 .filter((r) => !r.sudahDapat)
 .map((r, i) => ({
 id: r.id,
 label: r.nama,
 color: pickColor(i),
 })) ?? [];
 }
 } catch {}

 return <SpinningClient segments={peserta} />;
}

// beri warna bergantian biar kontras
function pickColor(i) {
 const palette = [
 "#60A5FA",
 "#34D399",
 "#FBBF24",
 "#F87171",
 "#A78BFA",
 "#22D3EE",
 "#F472B6",
 ];
 return palette[i % palette.length];
}
