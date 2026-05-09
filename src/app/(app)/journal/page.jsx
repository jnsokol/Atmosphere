import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CreateNotebookTile from "@/components/create-notebook-tile";

function NotebookSvg({ color }) {
  return (
    <svg viewBox="0 0 56 68" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-14 shrink-0">
      <rect x="1" y="6" width="9" height="56" rx="2" fill={color} opacity="0.25" />
      <rect x="8" y="4" width="44" height="60" rx="3" stroke={color} strokeWidth="2" />
      <circle cx="8" cy="18" r="3" stroke={color} strokeWidth="2" />
      <circle cx="8" cy="34" r="3" stroke={color} strokeWidth="2" />
      <circle cx="8" cy="50" r="3" stroke={color} strokeWidth="2" />
      <line x1="20" y1="22" x2="44" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="20" y1="31" x2="44" y2="31" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="20" y1="40" x2="38" y2="40" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export default async function JournalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: notebooks } = await supabase
    .from("notebooks")
    .select("id, name, color, created_at")
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
      <div>
        <h1 className="text-2xl font-bold">Journal</h1>
        <p className="text-xs text-white/35 mt-1">{(notebooks ?? []).length} notebooks</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Create tile — always first */}
        <CreateNotebookTile />

        {(notebooks ?? []).map((nb) => (
          <Link
            key={nb.id}
            href={`/journal/${nb.id}`}
            className="aspect-[3/4] rounded-2xl border border-white/[0.07] bg-white/[0.02] flex flex-col justify-between px-4 py-5 hover:border-white/15 hover:bg-white/[0.04] transition-all active:scale-[0.98]"
            style={{ borderTopColor: nb.color, borderTopWidth: 2 }}
          >
            <NotebookSvg color={nb.color} />
            <div>
              <p className="font-semibold text-sm leading-snug line-clamp-2">{nb.name}</p>
              <p className="text-xs text-white/30 mt-0.5">{countMap[nb.id] ?? 0} entries</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
