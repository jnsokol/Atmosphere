import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { computeXP, getLevelInfo, LEVELS } from "@/lib/gamification";
import { ArrowLeft } from "lucide-react";

export default async function LevelsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: entries }, { data: profile }] = await Promise.all([
    supabase.from("mood_entries").select("id, mood, energy, reflection, created_at, weather_snapshots(entry_id)").eq("user_id", user.id).limit(500),
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
  ]);

  const all = entries ?? [];
  const xp = computeXP(all, profile);
  const { current } = getLevelInfo(xp);

  return (
    <section className="flex flex-col gap-8">
      <div>
        <Link href="/profile" className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white w-fit transition-colors mb-5">
          <ArrowLeft size={14} /> Profile
        </Link>
        <h1 className="text-2xl font-bold">Levels</h1>
        <p className="mt-1 text-xs text-white/35">{xp} XP total · currently Lv.{current.level}</p>
      </div>

      <div className="flex flex-col gap-3">
        {LEVELS.map((lvl, i) => {
          const next = LEVELS[i + 1];
          const isCurrentLevel = lvl.level === current.level;
          const isUnlocked = xp >= lvl.xpRequired;
          const progress = isCurrentLevel && next
            ? Math.round(((xp - lvl.xpRequired) / (next.xpRequired - lvl.xpRequired)) * 100)
            : isUnlocked ? 100 : 0;

          return (
            <div
              key={lvl.level}
              className={`flex items-center gap-4 rounded-2xl px-4 py-4 transition-all ${
                isCurrentLevel
                  ? "bg-gradient-to-r from-atmosphere-day/10 to-atmosphere-dusk/10 border border-atmosphere-day/20"
                  : isUnlocked
                  ? "bg-white/[0.03]"
                  : "opacity-35"
              }`}
            >
              {/* Level badge */}
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${
                isCurrentLevel
                  ? "bg-gradient-to-br from-atmosphere-day/30 to-atmosphere-dusk/30 text-white ring-1 ring-atmosphere-day/40"
                  : isUnlocked
                  ? "bg-white/10 text-white/70"
                  : "bg-white/[0.04] text-white/25"
              }`}>
                {lvl.level}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`text-sm font-semibold ${isCurrentLevel ? "text-white" : isUnlocked ? "text-white/80" : "text-white/40"}`}>
                    {lvl.title}
                  </p>
                  {isCurrentLevel && (
                    <span className="rounded-full bg-atmosphere-day/20 px-2 py-0.5 text-[10px] font-semibold text-atmosphere-day">
                      You are here
                    </span>
                  )}
                </div>

                {/* Progress bar — only for current and future */}
                {(isCurrentLevel || !isUnlocked) && next && (
                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-atmosphere-day to-atmosphere-dusk transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* XP requirement */}
              <div className="text-right shrink-0">
                <p className={`text-xs ${isUnlocked ? "text-white/30" : "text-white/20"}`}>
                  {lvl.xpRequired} XP
                </p>
                {isCurrentLevel && next && (
                  <p className="text-[10px] text-white/20 mt-0.5">{next.xpRequired - xp} to go</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
