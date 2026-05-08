import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import EditEntryForm from "@/components/edit-entry-form";
import DeleteEntryButton from "@/components/delete-entry-button";
import WeatherChip from "@/components/weather-chip";

export default async function EntryDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: entry, error } = await supabase
    .from("mood_entries")
    .select("*, weather_snapshots(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !entry) notFound();

  const date = new Date(entry.created_at);
  const dateStr = date.toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <section className="max-w-lg">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/history" className="text-sm text-white/40 hover:text-white">← History</Link>
      </div>

      <p className="mb-6 text-sm text-white/50">{dateStr} · {timeStr}</p>

      <div className="mb-6 flex gap-8">
        <Stat label="Mood" value={entry.mood} />
        <Stat label="Energy" value={entry.energy} />
      </div>

      {entry.weather_snapshots && (
        <div className="mb-8">
          <WeatherChip weather={entry.weather_snapshots} />
          <div className="mt-2 flex gap-4 text-xs text-white/40">
            <span>💧 {entry.weather_snapshots.humidity}% humidity</span>
            <span>☁️ {entry.weather_snapshots.cloud_cover_pct}% cloud cover</span>
          </div>
        </div>
      )}

      {entry.reflection && (
        <blockquote className="mb-8 rounded-xl bg-white/5 px-5 py-4 text-sm leading-relaxed text-white/80">
          {entry.reflection}
        </blockquote>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-white/50">Edit entry</h2>
        <EditEntryForm entry={entry} />
        <DeleteEntryButton id={entry.id} />
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-white/40">{label}</span>
      <span className="text-4xl font-bold">{value}</span>
    </div>
  );
}
