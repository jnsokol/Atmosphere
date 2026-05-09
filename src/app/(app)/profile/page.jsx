import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { computeStreak, computeLongestStreak, computeXP, getLevelInfo, computeUnlockedAchievements } from "@/lib/gamification";
import { Settings } from "lucide-react";
import InstallAchievement from "@/components/install-achievement";
import { AchievementRow } from "@/components/achievement-row";

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
  const achievements = computeUnlockedAchievements(all, profile);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const displayName = profile?.display_name || user.email.split("@")[0];
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <section className="flex flex-col gap-8">

      {/* Profile header */}
      <div className="flex items-start justify-between gap-4 pt-2">
        <div className="flex items-center gap-4 min-w-0">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt="Avatar"
              width={96}
              height={96}
              className="rounded-2xl object-cover ring-1 ring-white/10"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-atmosphere-day/30 to-atmosphere-dusk/30 text-3xl font-bold ring-1 ring-white/10">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold truncate">{displayName}</h1>
            <p className="text-xs text-white/30 mt-0.5 truncate">{user.email}</p>
            {profile?.bio && (
              <p className="mt-1.5 text-sm text-white/55 leading-relaxed max-w-[180px]">{profile.bio}</p>
            )}
          </div>
        </div>
        <Link
          href="/profile/edit"
          className="shrink-0 flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/40 hover:border-white/20 hover:text-white transition-all"
        >
          <Settings size={11} /> Edit
        </Link>
      </div>

      {/* Level — standalone bar, tap to see all levels */}
      <Link href="/profile/levels" className="block mb-10 group">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold group-hover:text-atmosphere-day transition-colors">
            <span className="text-white/35 font-normal text-xs mr-1.5">Lv.{levelInfo.current.level}</span>
            {levelInfo.current.title}
          </p>
          <span className="text-xs text-white/25 group-hover:text-white/40 transition-colors">
            {xp} XP{levelInfo.next ? ` / ${levelInfo.next.xpRequired}` : ""} →
          </span>
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
      </Link>

      {/* Stats — big numbers, no boxes */}
      <div className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/20 mb-5">Stats</p>
        <div className="grid grid-cols-3 gap-y-7">
          <StatItem emoji="📓" value={all.length}          label="total entries" />
          <StatItem emoji="📈" value={avgMood}             label="avg mood" />
          <StatItem emoji="🔥" value={`${streak}d`}        label="streak" />
          <StatItem emoji="🏅" value={`${longestStreak}d`} label="longest streak" />
          <StatItem emoji="🌤️" value={all.filter((e) => e.weather_snapshots).length} label="with weather" />
          <StatItem emoji="⭐" value={`${unlockedCount}/${achievements.length}`} label="achievements" />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/[0.05] mb-8" />

      {/* Achievements preview */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/20">Achievements</p>
          <span className="text-xs text-white/25">{unlockedCount} / {achievements.length}</span>
        </div>

        <div className="flex flex-col gap-3">
          {achievements.slice(0, 4).map((a) => a.id === "app_installed"
            ? <InstallAchievement key={a.id} serverUnlocked={a.unlocked} />
            : <AchievementRow key={a.id} a={a} />
          )}
        </div>

        <Link
          href="/profile/achievements"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.07] py-3 text-sm text-white/40 hover:border-white/15 hover:text-white/70 transition-all"
        >
          See all {achievements.length} achievements
          <span className="text-white/20">→</span>
        </Link>
      </div>

    </section>
  );
}

function StatItem({ emoji, value, label }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl">{emoji}</span>
      <div className="flex flex-col gap-0.5">
        <span className="text-2xl font-bold leading-none">{value}</span>
        <span className="text-xs text-white/30">{label}</span>
      </div>
    </div>
  );
}

