import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { computeStreak, computeXP, getLevelInfo, computeUnlockedAchievements } from "@/lib/gamification";
import EntryCard from "@/components/entry-card";
import { Flame, TrendingUp, BookOpen, CalendarDays, AlertTriangle } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: entries }, { data: profile }] = await Promise.all([
    supabase.from("mood_entries").select("*, weather_snapshots(*)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(200),
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
  ]);

  const all = entries ?? [];
  const recent = all.slice(0, 3);
  const streak = computeStreak(all);
  const xp = computeXP(all);
  const { current: lvl, next, progress } = getLevelInfo(xp);
  const avgMood = all.length ? (all.reduce((s, e) => s + e.mood, 0) / all.length).toFixed(1) : null;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const yesterdayStr = new Date(now - 86400000).toISOString().slice(0, 10);
  const loggedToday = all.some((e) => e.created_at.slice(0, 10) === todayStr);
  const loggedYesterday = all.some((e) => e.created_at.slice(0, 10) === yesterdayStr);
  const streakAtRisk = streak > 0 && !loggedToday && !loggedYesterday;

  const displayName = profile?.display_name || user.email.split("@")[0];
  const hour = now.getUTCHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // 7-day mood strip
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1);
    const entry = all.find((e) => e.created_at.slice(0, 10) === dateStr);
    return { dateStr, dayLabel, mood: entry?.mood ?? null, isToday: dateStr === todayStr };
  });

  // This week entries count
  const weekStart = week[0].dateStr;
  const thisWeekCount = all.filter((e) => e.created_at.slice(0, 10) >= weekStart).length;

  // Next achievement to unlock
  const achievements = computeUnlockedAchievements(all);
  const nextAchievement = achievements.find((a) => !a.unlocked) ?? null;

  // Mood trend vs previous 7 days
  const avgLast7 = week.filter(d => d.mood).length
    ? (week.filter(d => d.mood).reduce((s, d) => s + d.mood, 0) / week.filter(d => d.mood).length).toFixed(1)
    : null;

  return (
    <section className="flex flex-col gap-6">

      {/* Greeting */}
      <div>
        <p className="text-xs text-white/35 mb-0.5">{greeting}</p>
        <h1 className="text-2xl font-bold">{displayName}</h1>
        <p className="mt-0.5 text-sm text-white/40">
          {loggedToday ? "You've logged today — great consistency." : "How are you feeling right now?"}
        </p>
      </div>

      {/* Streak at risk warning */}
      {streakAtRisk && (
        <div className="card flex items-center gap-3 px-4 py-3.5 border-orange-500/20 bg-orange-500/5">
          <AlertTriangle size={16} className="text-orange-400 shrink-0" />
          <p className="text-sm text-orange-300">Your {streak}-day streak is at risk — log now to keep it.</p>
          <Link href="/log" className="ml-auto shrink-0 rounded-full bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-300 hover:bg-orange-500/30 transition-colors">
            Log
          </Link>
        </div>
      )}

      {/* CTA */}
      {!loggedToday && !streakAtRisk && (
        <Link href="/log" className="card flex items-center gap-4 px-5 py-4 hover:bg-white/[0.07] transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-atmosphere-day/20 text-atmosphere-day text-lg">
            ✏️
          </div>
          <div>
            <p className="text-sm font-semibold">Log today's mood</p>
            <p className="text-xs text-white/40">Takes less than a minute</p>
          </div>
          <span className="ml-auto text-white/30">→</span>
        </Link>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard icon={<Flame size={15} className="text-orange-400" />}       label="Streak"     value={`${streak} days`} />
        <StatCard icon={<TrendingUp size={15} className="text-atmosphere-day" />} label="Avg mood"  value={avgMood ?? "—"} />
        <StatCard icon={<CalendarDays size={15} className="text-atmosphere-dusk" />} label="This week" value={`${thisWeekCount} entries`} />
        <StatCard icon={<BookOpen size={15} className="text-white/40" />}       label="Total"      value={`${all.length} entries`} />
      </div>

      {/* 7-day mood strip */}
      <div className="card px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/25">Last 7 days</p>
          {avgLast7 && <span className="text-xs text-white/30">avg {avgLast7}</span>}
        </div>
        <div className="flex items-end justify-between gap-1">
          {week.map(({ dateStr, dayLabel, mood, isToday }) => (
            <div key={dateStr} className="flex flex-1 flex-col items-center gap-1.5">
              <div className={`flex h-9 w-full max-w-[36px] items-center justify-center rounded-xl text-xs font-bold transition-all ${
                mood
                  ? mood >= 8 ? "bg-green-400/20 text-green-300"
                  : mood >= 6 ? "bg-atmosphere-day/20 text-atmosphere-day"
                  : mood >= 4 ? "bg-yellow-400/20 text-yellow-300"
                  : "bg-red-400/20 text-red-300"
                  : "bg-white/[0.04] text-white/20"
              } ${isToday ? "ring-1 ring-white/20" : ""}`}>
                {mood ?? "·"}
              </div>
              <span className={`text-[10px] font-medium ${isToday ? "text-white/60" : "text-white/20"}`}>
                {dayLabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Level */}
      <div className="card px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/35 mb-0.5">Level {lvl.level}</p>
            <p className="text-sm font-semibold">{lvl.title}</p>
          </div>
          <span className="text-xs text-white/30">{xp} XP{next ? ` / ${next.xpRequired}` : ""}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-atmosphere-day to-atmosphere-dusk transition-all" style={{ width: `${progress}%` }} />
        </div>
        {next && <p className="mt-2 text-xs text-white/25">{next.xpRequired - xp} XP to {next.title}</p>}
      </div>

      {/* Next achievement */}
      {nextAchievement && (
        <div className="card flex items-center gap-4 px-5 py-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.04] text-2xl opacity-60 grayscale">
            {nextAchievement.emoji}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-white/35 mb-0.5">Next achievement</p>
            <p className="text-sm font-semibold">{nextAchievement.title}</p>
            <p className="text-xs text-white/40 mt-0.5">{nextAchievement.desc}</p>
          </div>
          <Link href="/profile" className="ml-auto shrink-0 text-xs text-white/25 hover:text-white/60 transition-colors">
            View all →
          </Link>
        </div>
      )}

      {/* Recent */}
      {recent.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/25">Recent entries</p>
            <Link href="/history" className="text-xs text-white/30 hover:text-white transition-colors">See all →</Link>
          </div>
          <ul className="flex flex-col gap-2">
            {recent.map((e) => <li key={e.id}><EntryCard entry={e} /></li>)}
          </ul>
        </div>
      )}
    </section>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="card flex flex-col gap-2 px-4 py-3.5">
      <div className="flex items-center gap-1.5 text-xs text-white/40">{icon}{label}</div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
