import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { computeUnlockedAchievements } from "@/lib/gamification";
import { AchievementRow } from "@/app/(app)/profile/page";
import InstallAchievement from "@/components/install-achievement";
import { ArrowLeft } from "lucide-react";

export default async function AchievementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: entries }, { data: profile }] = await Promise.all([
    supabase.from("mood_entries").select("id, mood, energy, reflection, created_at, weather_snapshots(entry_id)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(500),
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
  ]);

  const all = entries ?? [];
  const achievements = computeUnlockedAchievements(all, profile);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked   = achievements.filter((a) => !a.unlocked);

  return (
    <section className="flex flex-col gap-8">
      <div>
        <Link href="/profile" className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white w-fit transition-colors mb-5">
          <ArrowLeft size={14} /> Profile
        </Link>
        <h1 className="text-2xl font-bold">Achievements</h1>
        <p className="mt-1 text-xs text-white/35">{unlockedCount} of {achievements.length} unlocked</p>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.08]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-atmosphere-day to-atmosphere-dusk transition-all"
          style={{ width: `${Math.round((unlockedCount / achievements.length) * 100)}%` }}
        />
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/20 mb-3">
            Unlocked · {unlocked.length}
          </p>
          <div className="flex flex-col gap-3">
            {unlocked.map((a) => a.id === "app_installed"
              ? <InstallAchievement key={a.id} serverUnlocked={a.unlocked} />
              : <AchievementRow key={a.id} a={a} />
            )}
          </div>
        </div>
      )}

      {/* Divider */}
      {unlocked.length > 0 && locked.length > 0 && (
        <div className="border-t border-white/[0.05]" />
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/20 mb-3">
            Locked · {locked.length}
          </p>
          <div className="flex flex-col gap-3">
            {locked.map((a) => a.id === "app_installed"
              ? <InstallAchievement key={a.id} serverUnlocked={a.unlocked} />
              : <AchievementRow key={a.id} a={a} />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
