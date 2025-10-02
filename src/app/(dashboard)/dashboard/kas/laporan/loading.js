export default function Loading() {
 return (
 <div className="space-y-4">
 <div className="h-6 w-64 animate-pulse rounded bg-neutral-200" />
 <div className="grid gap-4 sm:grid-cols-3">
 {[...Array(3)].map((_, i) => (
 <div
 key={i}
 className="h-20 animate-pulse rounded-2xl bg-neutral-200"
 />
 ))}
 </div>
 <div className="h-96 animate-pulse rounded-2xl bg-neutral-200" />
 </div>
 );
}
