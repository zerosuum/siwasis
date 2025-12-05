export function Skeleton({ className = "" }) {
  return (
    <div
      className={`wasis-skeleton rounded-[10px] bg-wasis-pr00 border border-[#E2E7D7]/60 ${className}`}
    />
  );
}

export function SkeletonLine({ className = "" }) {
  return <Skeleton className={`h-3 ${className}`} />;
}

export function SkeletonBadge({ className = "" }) {
  return <Skeleton className={`h-5 rounded-full ${className}`} />;
}

export function SkeletonAvatar({ className = "" }) {
  return <Skeleton className={`h-8 w-8 rounded-full ${className}`} />;
}

export function SkeletonCard({ className = "", children }) {
  return (
    <div
      className={`rounded-2xl border border-[#E2E7D7] bg-wasis-nt80 shadow-card p-4 ${className}`}
    >
      {children ?? <Skeleton className="h-20 w-full" />}
    </div>
  );
}
