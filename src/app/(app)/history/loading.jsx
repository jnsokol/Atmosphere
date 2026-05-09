import { EntryCardSkeleton, Skeleton } from "@/components/skeleton";

export default function HistoryLoading() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
      <Skeleton className="mb-6 h-10 w-full rounded-md" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => <EntryCardSkeleton key={i} />)}
      </div>
    </section>
  );
}
