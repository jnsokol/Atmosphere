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
      {a.unlocked && <span className="shrink-0 text-green-400">✓</span>}
    </div>
  );
}
