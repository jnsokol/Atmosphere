import { Skeleton } from "@/components/skeleton";

export default function ProfileLoading() {
  return (
    <section className="flex max-w-lg flex-col gap-8">
      <div className="flex items-center gap-6">
        <Skeleton className="h-24 w-24 rounded-full shrink-0" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-3 w-52" />
          <Skeleton className="h-4 w-64 mt-1" />
        </div>
      </div>
      <Skeleton className="h-9 w-28 rounded-md" />
      <Skeleton className="h-20 w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    </section>
  );
}
