import { SkeletonCard, SkeletonLine } from "./WasisSkeletonPrimitives";

export default function ArisanSpinwheelSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full wasis-skeleton" />
              <div className="flex-1 space-y-2">
                <SkeletonLine className="h-3 w-24" />
                <SkeletonLine className="h-5 w-28" />
                <SkeletonLine className="h-3 w-16" />
              </div>
            </div>
          </SkeletonCard>
        ))}
      </div>

      {/* tab nav */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <SkeletonLine className="h-4 w-28" />
          <SkeletonLine className="h-4 w-24" />
        </div>
        <SkeletonLine className="h-8 w-32 rounded-[999px]" />
      </div>

      {/* wheel */}
      <div className="flex justify-center py-8">
        <div className="relative h-[280px] w-[280px] rounded-full bg-wasis-pr00 border border-[#E2E7D7] wasis-skeleton">
          <div className="absolute -top-3 left-1/2 h-6 w-8 -translate-x-1/2 rounded-b-full bg-wasis-pr60/70" />
        </div>
      </div>

      {/* button */}
      <div className="flex justify-center">
        <SkeletonLine className="h-10 w-40 rounded-[999px]" />
      </div>
    </div>
  );
}
