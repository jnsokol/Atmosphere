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
    <section className="flex flex-col gap-6">

      {/* Hero */}
      <div className="card px-6 py-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            {profile?.avatar_url ? (
              <Image src={profile.avatar_url} alt="Avatar" width={72} height={72} className="rounded-2xl object-cover ring-1 ring-white/10" />
            ) : (
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-gradient-to-br from-atmosphere-day/30 to-atmosphere-dusk/30 text-2xl font-bold ring-1 ring-white/10">
                {initials}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">{displayName}</h1>
              <p className="text-xs text-white/35">{user.email}</p>
              {profile?.bio && <p className="mt-1.5 text-sm text-white/60 max-w-[200px]">{profile.bio}</p>}
            </div>
          </div>
          <Link href="/profile/edit" className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/50 hover:border-white/20 hover:text-white transition-all">
            <Settings size={12} /> Edit
          </Link>
        </div>

        {/* Level bar */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-white/60">Lv.{levelInfo.current.level} · {levelInfo.current.title}</span>
            <span className="text-xs text-white/25">{xp} XP</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-atmosphere-day to-atmosphere-dusk" style={{ width: `${levelInfo.progress}%` }} />
          </div>
          {levelInfo.next && <p className="mt-1.5 text-xs text-white/25">{levelInfo.next.xpRequired - xp} XP to Level {levelInfo.next.level}</p>}
        </div>
      </div>

      {/* Stats */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/25">Stats</p>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            ["Total entries", all.length],
            ["Avg mood", avgMood],
            ["Current streak", `${streak} days`],
            ["Longest streak", `${longestStreak} days`],
            ["With weather", all.filter((e) => e.weather_snapshots).length],
            ["Achievements", `${unlockedCount} / ${achievements.length}`],
          ].map(([label, value]) => (
            <div key={label} className="card px-4 py-3">
              <p className="text-xs text-white/35">{label}</p>
              <p className="mt-0.5 text-lg font-bold">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/25">Achievements</p>
        <div className="flex flex-wrap gap-3">
          {achievements.map((a) => (
            <div key={a.id} className="group relative flex flex-col items-center">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-all group-hover:scale-110 ${
                a.unlocked ? "bg-white/10 ring-1 ring-white/20 shadow-glow-sm" : "bg-white/[0.03] opacity-30 grayscale"
              }`}>
                {a.emoji}
              </div>
              <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-36 rounded-xl border border-white/10 bg-[#0b0d18] px-3 py-2 text-center opacity-0 shadow-xl transition-opacity group-hover:opacity-100 z-10">
                <p className="text-xs font-semibold">{a.title}</p>
                <p className="mt-0.5 text-xs text-white/40">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
