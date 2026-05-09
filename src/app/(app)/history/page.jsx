import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import EntryCard from "@/components/entry-card";
import { SlidersHorizontal } from "lucide-react";

export default async function HistoryPage({ searchParams }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase
    .from("mood_entries")
    .select("*, weather_snapshots(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (params?.min_mood) query = query.gte("mood", Number(params.min_mood));
  if (params?.from)     query = query.gte("created_at", params.from);
  if (params?.to)       query = query.lte("created_at", params.to);

  const { data: entries, error } = await query;
  if (error) return <p className="text-sm text-red-400">{error.message}</p>;

  const hasFilters = params?.min_mood || params?.from || params?.to;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">History</h1>
        <Link href="/log" className="btn-primary py-2 px-4 text-xs">+ New</Link>
      </div>

      {/* Filters */}
      <details className="card px-4 py-3">
        <summary className="flex cursor-pointer items-center gap-2 text-sm text-white/50 hover:text-white list-none">
          <SlidersHorizontal size={14} />
          <span>Filters</span>
          {hasFilters && <span className="ml-auto rounded-full bg-atmosphere-day/20 px-2 py-0.5 text-xs text-atmosphere-day">Active</span>}
        </summary>
        <form method="GET" className="mt-4 flex flex-wrap gap-3 text-sm">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-white/40">Min mood</span>
            <select name="min_mood" defaultValue={params?.min_mood ?? ""} className="input py-2 text-xs w-24">
              <option value="">Any</option>
              {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n}+</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-white/40">From</span>
            <input type="date" name="from" defaultValue={params?.from ?? ""} className="input py-2 text-xs" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-white/40">To</span>
            <input type="date" name="to" defaultValue={params?.to ?? ""} className="input py-2 text-xs" />
          </label>
          <div className="flex items-end gap-2">
            <button type="submit" className="btn-primary py-2 px-4 text-xs">Apply</button>
            {hasFilters && <Link href="/history" className="btn-ghost py-2 px-4 text-xs">Clear</Link>}
          </div>
        </form>
      </details>

      {entries.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
          <span className="text-4xl">📓</span>
          <p className="text-sm text-white/40">No entries yet. Start logging your mood.</p>
          <Link href="/log" className="btn-primary mt-2">Log first entry</Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {entries.map((e) => <li key={e.id}><EntryCard entry={e} /></li>)}
        </ul>
      )}
    </section>
  );
}
