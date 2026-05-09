import Link from "next/link";
import WeatherChip from "@/components/weather-chip";

function moodColor(mood) {
  if (mood >= 8) return "text-green-400";
  if (mood >= 6) return "text-atmosphere-day";
  if (mood >= 4) return "text-yellow-400";
  return "text-red-400";
}

function moodBg(mood) {
  if (mood >= 8) return "bg-green-400/10";
  if (mood >= 6) return "bg-atmosphere-day/10";
  if (mood >= 4) return "bg-yellow-400/10";
  return "bg-red-400/10";
}

export default function EntryCard({ entry }) {
  const date = new Date(entry.created_at);
  const dateStr = date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const timeStr = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <Link
      href={`/entries/${entry.id}`}
      className="card flex items-start gap-4 px-4 py-4 transition-all hover:bg-white/[0.07] active:scale-[0.99]"
    >
      {/* Mood badge */}
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${moodColor(entry.mood)} ${moodBg(entry.mood)}`}>
        {entry.mood}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-white/35">{dateStr} · {timeStr}</span>
          <span className="text-xs text-white/30">⚡ {entry.energy}</span>
        </div>
        {entry.weather_snapshots && (
          <div className="mt-1.5">
            <WeatherChip weather={entry.weather_snapshots} />
          </div>
        )}
        {entry.reflection && (
          <p className="mt-1.5 line-clamp-1 text-sm text-white/60">{entry.reflection}</p>
        )}
      </div>
    </Link>
  );
}
