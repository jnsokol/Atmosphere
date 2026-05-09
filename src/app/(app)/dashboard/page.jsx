import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { computeStreak, computeXP, getLevelInfo } from "@/lib/gamification";
import EntryCard from "@/components/entry-card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: entries }, { data: profile }] = await Promise.all([
    supabase
      .from("mood_entries")
      .select("*, weather_snapshots(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
  ]);

  const all = entries ?? [];
  const recent = all.slice(0, 3);
  const streak = computeStreak(all);
  const xp = computeXP(all);
  const { current: lvl, next, progress } = getLevelInfo(xp);
  const avgMood = all.length
    ? (all.reduce((s, e) => s + e.mood, 0) / all.length).toFixed(1)
    : "—";

  const todayStr = new Date().toISOString().slice(0, 10);
  const loggedToday = all.some((e) => e.created_at.slice(0, 10) === todayStr);
  const displayName = profile?.display_name ?? user.email.split("@")[0];

  return (
    <section className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Hey, {displayName} 👋</h1>
          <p className="mt-1 text-sm text-white/50">
            {loggedToday ? "You've logged today. Keep it up!" : "You haven't logged yet today."}
          </p>
        </div>
        <Link
          href="/log"
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-atmosphere-night hover:opacity-90"
        >
          + Log mood
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total entries" value={all.length} />
        <StatCard label="Avg mood" value={avgMood} />
        <StatCard label="Day streak" value={streak} suffix="🔥" />
      </div>

      {/* Level bar */}
      <div className="rounded-xl bg-white/5 px-5 py-4">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-medium">
            Level {lvl.level} — {lvl.title}
          </span>
          <span className="text-xs text-white/40">{xp} XP{next ? ` / ${next.xpRequired}` : ""}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-atmosphere-day transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        {next && (
          <p className="mt-1.5 text-xs text-white/30">
            {next.xpRequired - xp} XP to Level {next.level}
          </p>
        )}
      </div>

      {/* Recent entries */}
      {recent.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">Recent entries</h2>
            <Link href="/history" className="text-xs text-white/40 hover:text-white">View all →</Link>
          </div>
          <ul className="flex flex-col gap-2">
            {recent.map((e) => (
              <li key={e.id}><EntryCard entry={e} /></li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function StatCard({ label, value, suffix }) {
  return (
    <div className="rounded-xl bg-white/5 px-4 py-3">
      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}{suffix && <span className="ml-1 text-lg">{suffix}</span>}</p>
    </div>
  );
}
