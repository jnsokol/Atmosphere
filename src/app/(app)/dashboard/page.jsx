import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { computeStreak, computeXP, getLevelInfo, computeUnlockedAchievements } from "@/lib/gamification";
import EntryCard from "@/components/entry-card";
import Greeting from "@/components/greeting";
import { AlertTriangle } from "lucide-react";


export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: entries }, { data: profile }, { data: notebooks }] = await Promise.all([
    supabase.from("mood_entries").select("*, weather_snapshots(*)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(200),
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
    supabase.from("notebooks").select("id, title, color, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
  ]);

  // Latest entry across most recent notebooks
  let lastJournalEntry = null;
  let lastJournalNotebook = null;
  if (notebooks?.length) {
    const { data: latestEntry } = await supabase
      .from("journal_entries")
      .select("id, body, created_at, notebook_id")
      .in("notebook_id", notebooks.map((n) => n.id))
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    if (latestEntry) {
      lastJournalEntry = latestEntry;
      lastJournalNotebook = notebooks.find((n) => n.id === latestEntry.notebook_id) ?? null;
    }
  }

  const all = entries ?? [];
  const recent = all.slice(0, 3);
  const streak = computeStreak(all);
  const xp = computeXP(all, profile);
  const { current: lvl, next, progress } = getLevelInfo(xp);
  const avgMood = all.length ? (all.reduce((s, e) => s + e.mood, 0) / all.length).toFixed(1) : null;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const yesterdayStr = new Date(now - 86400000).toISOString().slice(0, 10);
  const loggedToday = all.some((e) => e.created_at.slice(0, 10) === todayStr);
  const loggedYesterday = all.some((e) => e.created_at.slice(0, 10) === yesterdayStr);
  const streakAtRisk = streak > 0 && !loggedToday && !loggedYesterday;

  const displayName = profile?.display_name || user.email.split("@")[0];

  // 7-day mood strip
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1);
    const entry = all.find((e) => e.created_at.slice(0, 10) === dateStr);
    return { dateStr, dayLabel, mood: entry?.mood ?? null, isToday: dateStr === todayStr };
  });

  const weekStart = week[0].dateStr;
  const thisWeekCount = all.filter((e) => e.created_at.slice(0, 10) >= weekStart).length;

  const achievements = computeUnlockedAchievements(all, profile);
  const nextAchievement = achievements.find((a) => !a.unlocked) ?? null;
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const avgLast7 = week.filter((d) => d.mood).length
    ? (week.filter((d) => d.mood).reduce((s, d) => s + d.mood, 0) / week.filter((d) => d.mood).length).toFixed(1)
    : null;

  return (
    <section className="flex flex-col gap-10">

      {/* Greeting */}
      <div className="pt-1">
        <Greeting />
        <h1 className="text-3xl font-bold mt-0.5">{displayName}</h1>
      </div>

      {/* Streak at risk */}
      {streakAtRisk && (
        <div className="flex items-center gap-3 rounded-2xl border border-orange-500/20 bg-orange-500/5 px-4 py-3.5">
          <AlertTriangle size={16} className="text-orange-400 shrink-0" />
          <p className="text-sm text-orange-300 flex-1">Your {streak}-day streak is at risk!</p>
          <Link href="/log" className="shrink-0 rounded-full bg-orange-400 px-4 py-1.5 text-xs font-bold text-black">
            Log now
          </Link>
        </div>
      )}

      {/* CTA */}
      {!loggedToday && !streakAtRisk && (
        <Link
          href="/log"
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-atmosphere-day/20 to-atmosphere-dusk/20 border border-atmosphere-day/20 px-6 py-5 flex items-center gap-4 hover:border-atmosphere-day/35 transition-all"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-atmosphere-day/30 to-atmosphere-dusk/30 text-2xl">
            ✏️
          </div>
          <div>
            <p className="font-bold text-base">Log today's mood</p>
            <p className="text-xs text-white/40 mt-0.5">Takes less than a minute</p>
          </div>
          <div className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/15 transition-colors text-white/60 text-sm">
            →
          </div>
          {/* subtle shimmer */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </Link>
      )}

      {/* Today logged confirmation */}
      {loggedToday && (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-400/15 text-green-400 text-base">✓</div>
          <p className="text-sm text-white/50">Logged today — great consistency.</p>
        </div>
      )}

      {/* Stats — no boxes, just numbers */}
      <div className="flex items-center justify-around">
        <Stat value={streak} label="day streak" accent="text-orange-400" icon="🔥" />
        <div className="h-12 w-px bg-white/[0.07]" />
        <Stat value={avgMood ?? "—"} label="avg mood" accent="text-atmosphere-day" icon="📈" />
        <div className="h-12 w-px bg-white/[0.07]" />
        <Stat value={thisWeekCount} label="this week" accent="text-atmosphere-dusk" icon="📅" />
        <div className="h-12 w-px bg-white/[0.07]" />
        <Stat value={all.length} label="total" accent="text-white/50" icon="📓" />
      </div>

      {/* 7-day strip — no card */}
      <div>
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/20">Last 7 days</p>
        </div>
        <div className="flex items-end justify-between gap-1.5">
          {week.map(({ dateStr, dayLabel, mood, isToday }) => (
            <div key={dateStr} className="flex flex-1 flex-col items-center gap-2">
              <div className={`flex h-10 w-full max-w-[40px] items-center justify-center rounded-2xl text-xs font-bold transition-all ${
                mood
                  ? mood >= 8 ? "bg-green-400/25 text-green-300"
                  : mood >= 6 ? "bg-atmosphere-day/25 text-atmosphere-day"
                  : mood >= 4 ? "bg-yellow-400/25 text-yellow-300"
                  : "bg-red-400/25 text-red-300"
                  : "bg-white/[0.04] text-white/15"
              } ${isToday ? "ring-1 ring-white/25" : ""}`}>
                {mood ?? "·"}
              </div>
              <span className={`text-[10px] font-medium ${isToday ? "text-white/50" : "text-white/20"}`}>
                {dayLabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Level — no card */}
      <Link href="/profile/levels" className="block group">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-sm font-semibold group-hover:text-atmosphere-day transition-colors">
            <span className="text-white/35 font-normal text-xs mr-1.5">Lv.{lvl.level}</span>
            {lvl.title}
          </p>
          <span className="text-xs text-white/25 group-hover:text-white/40 transition-colors">{xp} XP →</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-atmosphere-day to-atmosphere-dusk transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {next && (
          <p className="mt-1.5 text-xs text-white/20">{next.xpRequired - xp} XP to {next.title}</p>
        )}
      </Link>

      {/* Next achievement — no card */}
      {nextAchievement && (
        <div className="flex items-center gap-4">
          <span className="text-3xl grayscale opacity-40">{nextAchievement.emoji}</span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/20 mb-0.5">Next achievement</p>
            <p className="text-sm font-semibold">{nextAchievement.title}</p>
            <p className="text-xs text-white/35">{nextAchievement.desc}</p>
          </div>
          <Link href="/profile" className="shrink-0 text-xs text-white/20 hover:text-white/50 transition-colors">
            {unlockedCount}/{achievements.length} →
          </Link>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-white/[0.05]" />

      {/* Last journal entry */}
      {lastJournalEntry && lastJournalNotebook && (
        <Link href={`/journal/${lastJournalNotebook.id}`} className="group flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/20">Last journal entry</p>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 flex gap-3.5 items-start hover:bg-white/[0.05] transition-colors">
            <div className="mt-0.5 h-8 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: lastJournalNotebook.color }} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white/50 mb-0.5">{lastJournalNotebook.title}</p>
              <p className="text-sm text-white/80 line-clamp-2 leading-snug">
                {lastJournalEntry.body || <span className="text-white/30 italic">No text</span>}
              </p>
              <p className="mt-1.5 text-[10px] text-white/25">
                {new Date(lastJournalEntry.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <span className="text-white/20 group-hover:text-white/50 transition-colors text-sm mt-0.5">→</span>
          </div>
        </Link>
      )}

      {/* Recent entries */}
      {recent.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/20">Recent</p>
            <Link href="/history" className="text-xs text-white/25 hover:text-white/60 transition-colors">See all →</Link>
          </div>
          <ul className="flex flex-col gap-2">
            {recent.map((e) => <li key={e.id}><EntryCard entry={e} /></li>)}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="text-4xl">🌤️</span>
          <p className="text-sm text-white/40">No entries yet — log your first mood above.</p>
        </div>
      )}

    </section>
  );
}

function Stat({ value, label, accent, icon }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-2xl">{icon}</span>
      <span className={`text-3xl font-bold leading-none ${accent}`}>{value}</span>
      <span className="text-[11px] text-white/30 text-center leading-tight">{label}</span>
    </div>
  );
}
