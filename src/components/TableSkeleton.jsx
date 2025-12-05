import { SkeletonLine } from "./WasisSkeletonPrimitives";

export default function TableSkeleton({
  rows = 8,
  cols = 6,
  withToolbar = true,
}) {
  const fake = Array.from({ length: rows });
  const fakeCols = Array.from({ length: cols });

  return (
    <div className="space-y-3">
      {withToolbar && (
        <div className="flex items-center justify-between gap-3 px-4">
          <SkeletonLine className="h-4 w-40" />
          <div className="flex items-center gap-2">
            <SkeletonLine className="h-8 w-32 rounded-[999px]" />
            <SkeletonLine className="h-8 w-8 rounded-[12px]" />
            <SkeletonLine className="h-8 w-8 rounded-[12px]" />
          </div>
        </div>
      )}

      <div className="rounded-xl bg-white shadow overflow-hidden">
        <div className="min-w-full">
          {/* header */}
          <div className="grid grid-cols-[60px_repeat(auto-fill,minmax(80px,1fr))] min-h-[48px] border-b border-[#EEF0E8] px-4 py-2 text-xs font-semibold text-gray-500">
            {fakeCols.map((_, i) => (
              <div key={i} className="flex items-center">
                <SkeletonLine className="h-3 w-16" />
              </div>
            ))}
          </div>

          {/* rows */}
          {fake.map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[60px_repeat(auto-fill,minmax(80px,1fr))] px-4 py-3 border-b border-[#F3F4EF]"
            >
              {fakeCols.map((__, j) => (
                <div key={j} className="flex items-center gap-2">
                  <SkeletonLine
                    className={`h-3 w-${j === 0 ? "6" : "24"} max-w-[120px]`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* pagination */}
      <div className="flex items-center justify-center gap-2 px-4 pb-2">
        <SkeletonLine className="h-8 w-20 rounded-[999px]" />
        <SkeletonLine className="h-8 w-24 rounded-[999px]" />
        <SkeletonLine className="h-8 w-20 rounded-[999px]" />
      </div>
    </div>
  );
}
