import { ChartSkeleton, Skeleton } from "@/components/skeleton";

export default function InsightsLoading() {
  return (
    <section className="flex flex-col gap-10">
      <div>
        <Skeleton className="h-7 w-24 mb-1" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-20 w-full rounded-xl" />
      <ChartSkeleton /><ChartSkeleton />
    </section>
  );
}
