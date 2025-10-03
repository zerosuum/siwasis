export default function SectionCards({ items = [] }) {
 return (
 <div className="grid gap-4 sm:grid-cols-3">
 {items.map((it, i) => (
 <div key={i} className="rounded-2xl border bg-white shadow-sm">
 <div className="p-4">
 <div className="text-xs text-neutral-500">{it.label}</div>
 <div className="mt-1 font-semibold tabular-nums">{it.value}</div>
 </div>
 </div>
 ))}
 </div>
 );
}
