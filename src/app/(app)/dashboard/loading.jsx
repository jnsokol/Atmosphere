import { StatCardSkeleton, EntryCardSkeleton, Skeleton } from "@/components/skeleton";

export default function DashboardLoading() {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
      </div>
      <Skeleton className="h-20 w-full rounded-xl" />
      <div className="flex flex-col gap-2">
        <EntryCardSkeleton /><EntryCardSkeleton /><EntryCardSkeleton />
      </div>
    </section>
  );
}
