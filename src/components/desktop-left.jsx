import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { computeStreak, computeXP, getLevelInfo } from "@/lib/gamification";
import DesktopNav from "@/components/desktop-nav";

export default async function DesktopLeft() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: entries }, { data: profile }] = await Promise.all([
    supabase.from("mood_entries").select("created_at, mood").eq("user_id", user.id).order("created_at", { ascending: false }).limit(200),
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
  ]);

  const all = entries ?? [];
  const streak = computeStreak(all);
  const xp = computeXP(all, profile);
  const { current: lvl, next, progress } = getLevelInfo(xp);
  const displayName = profile?.display_name || user.email.split("@")[0];

  return (
    <aside className="hidden lg:flex flex-col gap-6 sticky top-0 h-dvh py-8 px-5 border-r border-white/[0.06] overflow-y-auto">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-1">
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-atmosphere-day via-atmosphere-dusk to-atmosphere-dusk opacity-90 shadow-glow-sm" />
        <span className="font-display text-[17px] font-bold tracking-tight bg-gradient-to-r from-atmosphere-day to-atmosphere-dusk bg-clip-text text-transparent">
          Atmosphere
        </span>
      </Link>

      {/* Profile */}
      <div className="flex flex-col items-center text-center gap-2 pt-2">
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="h-16 w-16 rounded-full object-cover ring-2 ring-white/10" />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-atmosphere-day/30 to-atmosphere-dusk/30 flex items-center justify-center text-2xl font-bold text-white/60">
            {displayName[0].toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-bold text-base leading-tight">{displayName}</p>
          {profile?.bio && <p className="text-xs text-white/40 mt-1 leading-relaxed line-clamp-3">{profile.bio}</p>}
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/35">Streak</span>
          <span className="text-sm font-bold text-orange-400">🔥 {streak} days</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/35">Level</span>
          <span className="text-sm font-semibold">{lvl.level} · {lvl.title}</span>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-white/35">{xp} XP</span>
            {next && <span className="text-xs text-white/25">{next.xpRequired - xp} to next</span>}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-atmosphere-day to-atmosphere-dusk"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1">
        <DesktopNav />
      </div>

      <Link href="/profile" className="text-xs text-white/20 hover:text-white/50 transition-colors text-center">
        Edit profile →
      </Link>
    </aside>
  );
}
