import { SkeletonCard, SkeletonLine } from "./WasisSkeletonPrimitives";
import TableSkeleton from "./TableSkeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI cards row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full wasis-skeleton" />
              <div className="flex-1 space-y-2">
                <SkeletonLine className="h-3 w-24" />
                <SkeletonLine className="h-5 w-32" />
                <SkeletonLine className="h-3 w-20" />
              </div>
            </div>
          </SkeletonCard>
        ))}
      </div>

      {/* mini chart */}
      <SkeletonCard className="h-40" />

      {/* table */}
      <TableSkeleton rows={6} cols={5} withToolbar={false} />
    </div>
  );
}
