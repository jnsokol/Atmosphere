import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { computeStreak, computeLongestStreak, computeXP, getLevelInfo, computeUnlockedAchievements } from "@/lib/gamification";
import { Settings } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: entries }, { data: profile }] = await Promise.all([
    supabase.from("mood_entries").select("id, mood, energy, reflection, created_at, weather_snapshots(entry_id)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(500),
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
  ]);

  const all = entries ?? [];
  const xp = computeXP(all);
  const levelInfo = getLevelInfo(xp);
  const streak = computeStreak(all);
  const longestStreak = computeLongestStreak(all);
  const avgMood = all.length ? (all.reduce((s, e) => s + e.mood, 0) / all.length).toFixed(1) : "—";
  const achievements = computeUnlockedAchievements(all);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const displayName = profile?.display_name || user.email.split("@")[0];
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <section className="flex flex-col">

      {/* Banner + avatar */}
      <div className="relative -mx-5 mb-16">
        {/* Gradient banner */}
        <div className="h-32 w-full bg-gradient-to-br from-atmosphere-day/30 via-atmosphere-dusk/20 to-transparent" />

        {/* Avatar — overlaps banner */}
        <div className="absolute -bottom-12 left-5 flex items-end gap-4">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt="Avatar"
              width={88}
              height={88}
              className="rounded-3xl object-cover ring-2 ring-atmosphere-night shadow-xl"
            />
          ) : (
            <div className="flex h-[88px] w-[88px] items-center justify-center rounded-3xl bg-gradient-to-br from-atmosphere-day/40 to-atmosphere-dusk/40 text-3xl font-bold ring-2 ring-atmosphere-night shadow-xl">
              {initials}
            </div>
          )}
        </div>

        {/* Edit button top-right */}
        <Link
          href="/profile/edit"
          className="absolute bottom-3 right-0 flex items-center gap-1.5 rounded-full border border-white/10 bg-atmosphere-night/80 px-3 py-1.5 text-xs text-white/50 hover:border-white/25 hover:text-white transition-all backdrop-blur-sm"
        >
          <Settings size={11} /> Edit profile
        </Link>
      </div>

      {/* Name + bio */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{displayName}</h1>
        <p className="text-xs text-white/30 mt-0.5">{user.email}</p>
        {profile?.bio && (
          <p className="mt-2 text-sm text-white/55 leading-relaxed max-w-sm">{profile.bio}</p>
        )}
      </div>

      {/* Level — standalone bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">
            <span className="text-white/35 font-normal text-xs mr-1.5">Lv.{levelInfo.current.level}</span>
            {levelInfo.current.title}
          </p>
          <span className="text-xs text-white/25">{xp} XP{levelInfo.next ? ` / ${levelInfo.next.xpRequired}` : ""}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-atmosphere-day to-atmosphere-dusk transition-all duration-500"
            style={{ width: `${levelInfo.progress}%` }}
          />
        </div>
        {levelInfo.next && (
          <p className="mt-1.5 text-xs text-white/20">
            {levelInfo.next.xpRequired - xp} XP to {levelInfo.next.title}
          </p>
        )}
      </div>

      {/* Stats — big numbers, no boxes */}
      <div className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/20 mb-5">Stats</p>
        <div className="grid grid-cols-3 gap-y-7">
          <StatItem value={all.length}          label="total entries" />
          <StatItem value={avgMood}             label="avg mood" />
          <StatItem value={`${streak}d`}        label="streak" />
          <StatItem value={`${longestStreak}d`} label="longest streak" />
          <StatItem value={all.filter((e) => e.weather_snapshots).length} label="with weather" />
          <StatItem value={`${unlockedCount}/${achievements.length}`} label="achievements" />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/[0.05] mb-8" />

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/20">Achievements</p>
          <span className="text-xs text-white/25">{unlockedCount} / {achievements.length}</span>
        </div>

        <div className="flex flex-col gap-3">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`flex items-center gap-4 transition-opacity ${a.unlocked ? "" : "opacity-35"}`}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${
                a.unlocked
                  ? "bg-white/10 ring-1 ring-white/15"
                  : "bg-white/[0.03] grayscale"
              }`}>
                {a.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold ${a.unlocked ? "text-white" : "text-white/50"}`}>
                  {a.title}
                </p>
                <p className="text-xs text-white/30 mt-0.5">{a.desc}</p>
              </div>
              {a.unlocked && (
                <span className="shrink-0 text-green-400 text-base">✓</span>
              )}
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

function StatItem({ value, label }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs text-white/30">{label}</span>
    </div>
  );
}
