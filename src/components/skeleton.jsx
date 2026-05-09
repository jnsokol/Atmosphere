export function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-md bg-white/10 ${className}`} />
  );
}

export function EntryCardSkeleton() {
  return (
    <div className="flex items-start justify-between rounded-xl bg-white/5 px-5 py-4">
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-8 w-8 ml-4 shrink-0" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl bg-white/5 px-4 py-3">
      <Skeleton className="h-3 w-20 mb-2" />
      <Skeleton className="h-7 w-12" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl bg-white/5 p-4">
      <Skeleton className="h-3 w-32 mb-4" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}
