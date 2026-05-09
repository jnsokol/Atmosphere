import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createNotebook } from "@/server/actions/journal";
import { Plus } from "lucide-react";

const COLORS = ["#7cb9e8","#9b6b9e","#4ade80","#f4a261","#f472b6","#f87171","#fbbf24","#2dd4bf"];

function NotebookSvg({ color }) {
  return (
    <svg viewBox="0 0 56 68" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
      {/* spine */}
      <rect x="1" y="6" width="9" height="56" rx="2" fill={color} opacity="0.25" />
      {/* body */}
      <rect x="8" y="4" width="44" height="60" rx="3" stroke={color} strokeWidth="2" />
      {/* rings */}
      <circle cx="8" cy="18" r="3" stroke={color} strokeWidth="2" />
      <circle cx="8" cy="34" r="3" stroke={color} strokeWidth="2" />
      <circle cx="8" cy="50" r="3" stroke={color} strokeWidth="2" />
      {/* lines */}
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

      {/* New notebook form */}
      <form action={createNotebook} className="card px-4 py-4 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/25">New notebook</p>
        <input name="name" placeholder="Notebook name…" required className="input" />
        <div className="flex items-center gap-3">
          <p className="text-xs text-white/30 shrink-0">Color</p>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((c, i) => (
              <label key={c} className="relative cursor-pointer">
                <input type="radio" name="color" value={c} defaultChecked={i === 0} className="sr-only peer" />
                <span
                  className="block h-6 w-6 rounded-full ring-2 ring-transparent peer-checked:ring-white/60 peer-checked:scale-110 transition-all"
                  style={{ background: c }}
                />
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="btn-primary flex items-center justify-center gap-2">
          <Plus size={15} /> Create notebook
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
              className="card flex flex-col gap-3 px-4 py-5 hover:border-white/15 transition-all active:scale-[0.98]"
              style={{ borderTopColor: nb.color, borderTopWidth: 2 }}
            >
              <NotebookSvg color={nb.color} />
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
