import { createClient } from "@/lib/supabase/server";
import {
  computeStreak, computeLongestStreak, computeXP,
  getLevelInfo, computeUnlockedAchievements,
} from "@/lib/gamification";
import ProfileForm from "@/components/profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: entries }, { data: profile }] = await Promise.all([
    supabase
      .from("mood_entries")
      .select("id, mood, energy, reflection, created_at, weather_snapshots(entry_id)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(500),
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
  ]);

  const all = entries ?? [];
  const xp = computeXP(all);
  const levelInfo = getLevelInfo(xp);
  const streak = computeStreak(all);
  const longestStreak = computeLongestStreak(all);
  const avgMood = all.length
    ? (all.reduce((s, e) => s + e.mood, 0) / all.length).toFixed(1)
    : "—";
  const achievements = computeUnlockedAchievements(all);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <section className="flex max-w-lg flex-col gap-8">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <ProfileForm user={user} profile={profile} />

      {/* Level */}
      <div className="rounded-xl bg-white/5 px-5 py-4">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-semibold">
            Level {levelInfo.current.level} — {levelInfo.current.title}
          </span>
          <span className="text-xs text-white/40">{xp} XP</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-atmosphere-day"
            style={{ width: `${levelInfo.progress}%` }}
          />
        </div>
        {levelInfo.next && (
          <p className="mt-1.5 text-xs text-white/30">
            {levelInfo.next.xpRequired - xp} XP to Level {levelInfo.next.level} · {levelInfo.next.title}
          </p>
        )}
      </div>

      {/* Stats */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">Stats</h2>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Total entries" value={all.length} />
          <Stat label="Avg mood" value={avgMood} />
          <Stat label="Current streak" value={`${streak} days`} />
          <Stat label="Longest streak" value={`${longestStreak} days`} />
          <Stat label="With weather" value={all.filter((e) => e.weather_snapshots).length} />
          <Stat label="Achievements" value={`${unlockedCount} / ${achievements.length}`} />
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">Achievements</h2>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`rounded-xl px-4 py-3 ${
                a.unlocked ? "bg-white/10" : "bg-white/5 opacity-40"
              }`}
            >
              <span className="text-2xl">{a.emoji}</span>
              <p className="mt-1 text-sm font-medium">{a.title}</p>
              <p className="text-xs text-white/50">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-white/5 px-4 py-3">
      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-0.5 text-lg font-semibold">{value}</p>
    </div>
  );
}
