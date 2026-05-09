import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createNotebook } from "@/server/actions/journal";
import { Plus } from "lucide-react";

export default async function JournalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: notebooks } = await supabase
    .from("notebooks")
    .select("id, name, emoji, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const counts = await Promise.all(
    (notebooks ?? []).map(async (nb) => {
      const { count } = await supabase
        .from("journal_entries")
        .select("id", { count: "exact", head: true })
        .eq("notebook_id", nb.id);
      return { id: nb.id, count: count ?? 0 };
    })
  );
  const countMap = Object.fromEntries(counts.map((c) => [c.id, c.count]));

  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Journal</h1>
          <p className="text-xs text-white/35 mt-1">{(notebooks ?? []).length} notebooks</p>
        </div>
      </div>

      {/* New notebook form */}
      <form action={createNotebook} className="flex gap-2">
        <input
          name="emoji"
          defaultValue="📓"
          maxLength={2}
          className="w-14 rounded-xl border border-white/[0.07] bg-white/[0.05] px-3 py-3 text-center text-lg outline-none focus:border-white/20"
        />
        <input
          name="name"
          placeholder="New notebook name…"
          required
          className="input flex-1"
        />
        <button type="submit" className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-atmosphere-day to-atmosphere-dusk text-white">
          <Plus size={18} />
        </button>
      </form>

      {/* Notebooks grid */}
      {(notebooks ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <span className="text-5xl">📓</span>
          <p className="text-white/40 text-sm">No notebooks yet. Create your first one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {(notebooks ?? []).map((nb) => (
            <Link
              key={nb.id}
              href={`/journal/${nb.id}`}
              className="card flex flex-col gap-3 px-4 py-4 hover:border-white/15 transition-all active:scale-[0.98]"
            >
              <span className="text-3xl">{nb.emoji}</span>
              <div>
                <p className="font-semibold text-sm leading-snug">{nb.name}</p>
                <p className="text-xs text-white/30 mt-0.5">{countMap[nb.id] ?? 0} entries</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
