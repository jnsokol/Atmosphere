import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import EntryCard from "@/components/entry-card";

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
  if (params?.from) query = query.gte("created_at", params.from);
  if (params?.to) query = query.lte("created_at", params.to);

  const { data: entries, error } = await query;

  if (error) return <p className="text-red-400 text-sm">{error.message}</p>;

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">History</h1>
        <Link
          href="/log"
          className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-atmosphere-night hover:opacity-90"
        >
          + New entry
        </Link>
      </div>

      <HistoryFilters params={params} />

      {entries.length === 0 ? (
        <p className="mt-12 text-center text-white/40">No entries yet. Start by logging your mood.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <li key={entry.id}>
              <EntryCard entry={entry} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function HistoryFilters({ params }) {
  return (
    <form method="GET" className="mb-6 flex flex-wrap gap-3 text-sm">
      <div className="flex items-center gap-2">
        <label className="text-white/50">Min mood</label>
        <select
          name="min_mood"
          defaultValue={params?.min_mood ?? ""}
          className="rounded bg-white/10 px-2 py-1 text-white outline-none"
        >
          <option value="">Any</option>
          {[1,2,3,4,5,6,7,8,9,10].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-white/50">From</label>
        <input
          type="date"
          name="from"
          defaultValue={params?.from ?? ""}
          className="rounded bg-white/10 px-2 py-1 text-white outline-none"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-white/50">To</label>
        <input
          type="date"
          name="to"
          defaultValue={params?.to ?? ""}
          className="rounded bg-white/10 px-2 py-1 text-white outline-none"
        />
      </div>
      <button
        type="submit"
        className="rounded bg-white/10 px-3 py-1 text-white hover:bg-white/20"
      >
        Filter
      </button>
      {(params?.min_mood || params?.from || params?.to) && (
        <Link href="/history" className="rounded bg-white/10 px-3 py-1 text-white/50 hover:bg-white/20">
          Clear
        </Link>
      )}
    </form>
  );
}
