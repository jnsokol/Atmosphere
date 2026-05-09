export function AchievementRow({ a }) {
  return (
    <div className={`flex items-center gap-4 transition-opacity ${a.unlocked ? "" : "opacity-35"}`}>
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${
        a.unlocked ? "bg-white/10 ring-1 ring-white/15" : "bg-white/[0.03] grayscale"
      }`}>
        {a.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold ${a.unlocked ? "text-white" : "text-white/50"}`}>{a.title}</p>
        <p className="text-xs text-white/30 mt-0.5">{a.desc}</p>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-1">
        {a.unlocked && <span className="text-green-400 text-sm">✓</span>}
        <span className={`text-[10px] font-semibold ${a.unlocked ? "text-atmosphere-day/70" : "text-white/20"}`}>+{a.xp} XP</span>
      </div>
    </div>
  );
}
