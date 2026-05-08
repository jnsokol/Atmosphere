import Link from "next/link";
import WeatherChip from "@/components/weather-chip";

const MOOD_COLORS = {
  high: "text-green-400",
  mid: "text-yellow-400",
  low: "text-red-400",
};

function moodColor(mood) {
  if (mood >= 7) return MOOD_COLORS.high;
  if (mood >= 4) return MOOD_COLORS.mid;
  return MOOD_COLORS.low;
}

export default function EntryCard({ entry }) {
  const date = new Date(entry.created_at);
  const dateStr = date.toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short",
  });
  const timeStr = date.toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <Link
      href={`/entries/${entry.id}`}
      className="flex items-start justify-between rounded-xl bg-white/5 px-5 py-4 transition-colors hover:bg-white/10"
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-white/50">{dateStr} · {timeStr}</span>
        {entry.weather_snapshots && (
          <WeatherChip weather={entry.weather_snapshots} />
        )}
        {entry.reflection && (
          <p className="mt-1 line-clamp-2 text-sm text-white/80">{entry.reflection}</p>
        )}
      </div>
      <div className="ml-4 flex shrink-0 flex-col items-end gap-1">
        <span className={`text-xl font-bold ${moodColor(entry.mood)}`}>{entry.mood}</span>
        <span className="text-xs text-white/40">⚡ {entry.energy}</span>
      </div>
    </Link>
  );
}
