export function Tabs({ items, value, onChange }) {
 return (
 <div className="flex gap-6 border-b">
 {items.map((it) => (
 <button
 key={it.value}
 onClick={() => onChange(it.value)}
 className={`-mb-px border-b-2 pb-2 text-sm ${
 value === it.value
 ? "border-brand text-brand"
 : "border-transparent text-neutral-500 hover:text-neutral-800"
 }`}
 >
 {it.label}
 </button>
 ))}
 </div>
 );
}
