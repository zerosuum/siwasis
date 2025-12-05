import { Skeleton, SkeletonLine } from "./WasisSkeletonPrimitives";

export default function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* profile card */}
      <div className="grid gap-4 md:grid-cols-[2fr,1.2fr]">
        <div className="rounded-xl bg-white shadow p-5 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <SkeletonLine className="h-4 w-40" />
              <SkeletonLine className="h-3 w-32" />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <SkeletonLine className="h-3 w-24" />
            <SkeletonLine className="h-3 w-56" />
            <SkeletonLine className="h-3 w-24 mt-2" />
            <SkeletonLine className="h-3 w-40" />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <SkeletonLine className="h-9 w-32 rounded-[999px]" />
            <SkeletonLine className="h-9 w-32 rounded-[999px]" />
            <SkeletonLine className="h-9 w-32 rounded-[999px]" />
          </div>
        </div>

        {/* daftar admin */}
        <div className="rounded-xl bg-white shadow p-5 space-y-4">
          <SkeletonLine className="h-4 w-32" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-[#EEF0E8] py-3 last:border-0"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <SkeletonLine className="h-3 w-32" />
                  <SkeletonLine className="h-3 w-40" />
                </div>
              </div>
              <SkeletonLine className="h-8 w-20 rounded-[999px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
