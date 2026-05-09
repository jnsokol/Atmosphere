import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BarChart2, Clock, BookOpen, PenLine } from "lucide-react";

export default async function DesktopRight() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const [{ data: entries }, { data: notebooks }] = await Promise.all([
    supabase.from("mood_entries").select("created_at, mood, energy").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("notebooks").select("id, name, color").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1),
  ]);

  const loggedToday = (entries ?? []).some((e) => e.created_at.slice(0, 10) === todayStr);

  let lastEntry = null;
  let lastNotebook = notebooks?.[0] ?? null;
  if (lastNotebook) {
    const { data } = await supabase
      .from("journal_entries")
      .select("id, body, created_at")
      .eq("notebook_id", lastNotebook.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    lastEntry = data ?? null;
  }

  return (
    <aside className="hidden lg:flex flex-col gap-4 sticky top-0 h-dvh py-8 px-5 border-l border-white/[0.06] overflow-y-auto">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/20 px-1">Quick access</p>

      {/* Log mood */}
      <Link
        href="/log"
        className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-4 hover:bg-white/[0.05] hover:border-atmosphere-day/30 transition-all"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="h-8 w-8 rounded-xl bg-atmosphere-day/15 flex items-center justify-center">
            <PenLine size={15} className="text-atmosphere-day" />
          </div>
          <p className="text-sm font-semibold">Log mood</p>
        </div>
        <p className="text-xs text-white/35 ml-11">
          {loggedToday ? "Logged today ✓" : "Haven't logged yet today"}
        </p>
      </Link>

      {/* Journal */}
      {lastNotebook && (
        <Link
          href={`/journal/${lastNotebook.id}`}
          className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-4 hover:bg-white/[0.05] transition-all"
          style={{ borderTopColor: lastNotebook.color, borderTopWidth: 2 }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-8 rounded-xl bg-white/[0.06] flex items-center justify-center">
              <BookOpen size={15} className="text-white/50" />
            </div>
            <p className="text-sm font-semibold truncate">{lastNotebook.name}</p>
          </div>
          {lastEntry ? (
            <p className="text-xs text-white/35 ml-11 line-clamp-2 leading-relaxed">
              {lastEntry.body || <span className="italic">No text</span>}
            </p>
          ) : (
            <p className="text-xs text-white/25 ml-11">No entries yet</p>
          )}
        </Link>
      )}

      {!lastNotebook && (
        <Link
          href="/journal"
          className="rounded-2xl border border-dashed border-white/[0.07] px-4 py-4 hover:border-white/15 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-white/[0.04] flex items-center justify-center">
              <BookOpen size={15} className="text-white/30" />
            </div>
            <p className="text-sm text-white/40">Start a journal</p>
          </div>
        </Link>
      )}

      {/* Insights */}
      <Link
        href="/insights"
        className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-4 hover:bg-white/[0.05] transition-all"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="h-8 w-8 rounded-xl bg-atmosphere-dusk/15 flex items-center justify-center">
            <BarChart2 size={15} className="text-atmosphere-dusk" />
          </div>
          <p className="text-sm font-semibold">Insights</p>
        </div>
        <p className="text-xs text-white/35 ml-11">Charts &amp; patterns from your data</p>
      </Link>

      {/* History */}
      <Link
        href="/history"
        className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-4 hover:bg-white/[0.05] transition-all"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="h-8 w-8 rounded-xl bg-white/[0.06] flex items-center justify-center">
            <Clock size={15} className="text-white/50" />
          </div>
          <p className="text-sm font-semibold">History</p>
        </div>
        {entries?.[0] && (
          <p className="text-xs text-white/35 ml-11">
            Last entry: mood {entries[0].mood} · energy {entries[0].energy}
          </p>
        )}
      </Link>
    </aside>
  );
}
