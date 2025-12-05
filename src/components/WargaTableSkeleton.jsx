import {
  Skeleton,
  SkeletonLine,
  SkeletonBadge,
} from "./WasisSkeletonPrimitives";

export default function ResidentsTableSkeleton({ rows = 9 }) {
  const fake = Array.from({ length: rows });

  const colTemplate = "60px 60px minmax(160px,1.6fr) 120px 140px 120px 120px";

  return (
    <div className="space-y-3">
      {/* toolbar */}
      <div className="flex items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-4">
          <SkeletonLine className="h-4 w-24" />
          <SkeletonLine className="h-4 w-28" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonLine className="h-8 w-32 rounded-[999px]" />
          <SkeletonLine className="h-8 w-8 rounded-[12px]" />
          <SkeletonLine className="h-8 w-8 rounded-[12px]" />
        </div>
      </div>

      <div className="rounded-xl bg-white shadow overflow-hidden">
        {/* header */}
        <div
          className="grid min-h-[48px] border-b border-[#EEF0E8] px-4 py-2 text-xs font-semibold text-gray-500"
          style={{ gridTemplateColumns: colTemplate }}
        >
          {[
            "No",
            "RT",
            "Nama",
            "Role",
            "Status Arisan",
            "Total Kas",
            "Total Arisan",
          ].map((label) => (
            <div key={label} className="flex items-center">
              <SkeletonLine className="h-3 w-20" />
            </div>
          ))}
        </div>

        {/* rows */}
        {fake.map((_, i) => (
          <div
            key={i}
            className="grid px-4 py-[14px] border-b border-[#F3F4EF]"
            style={{ gridTemplateColumns: colTemplate }}
          >
            {/* No */}
            <div className="flex items-center">
              <SkeletonLine className="h-3 w-5" />
            </div>
            {/* RT */}
            <div className="flex items-center">
              <SkeletonLine className="h-3 w-6" />
            </div>
            {/* Nama + kota */}
            <div className="flex flex-col gap-1">
              <SkeletonLine className="h-3 w-32" />
              <SkeletonLine className="h-3 w-24" />
            </div>
            {/* Role */}
            <div className="flex items-center">
              <SkeletonBadge className="w-16" />
            </div>
            {/* Status Arisan */}
            <div className="flex items-center">
              <SkeletonBadge className="w-24" />
            </div>
            {/* Total kas */}
            <div className="flex items-center">
              <SkeletonLine className="h-3 w-20" />
            </div>
            {/* Total arisan */}
            <div className="flex items-center justify-between gap-2">
              <SkeletonLine className="h-3 w-20" />
              {/* aksi icon di kanan: edit/delete */}
              <div className="flex gap-2">
                <Skeleton className="h-7 w-7 rounded-[10px]" />
                <Skeleton className="h-7 w-7 rounded-[10px]" />
              </div>
            </div>
          </div>
        ))}
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
