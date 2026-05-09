import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import EditEntryForm from "@/components/edit-entry-form";
import DeleteEntryButton from "@/components/delete-entry-button";
import WeatherChip from "@/components/weather-chip";
import { ArrowLeft } from "lucide-react";

export default async function EntryDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: entry, error } = await supabase
    .from("mood_entries").select("*, weather_snapshots(*)")
    .eq("id", id).eq("user_id", user.id).single();

  if (error || !entry) notFound();

  const date = new Date(entry.created_at);
  const dateStr = date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const timeStr = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <section className="flex flex-col gap-6">
      <Link href="/history" className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white w-fit">
        <ArrowLeft size={14} /> History
      </Link>

      <p className="text-sm text-white/40">{dateStr} · {timeStr}</p>

      {/* Scores */}
      <div className="card flex gap-8 px-6 py-5">
        <Score label="Mood"   value={entry.mood}   color="#7cb9e8" />
        <Score label="Energy" value={entry.energy} color="#9b6b9e" />
      </div>

      {/* Weather */}
      {entry.weather_snapshots && (
        <div className="card px-5 py-4 flex flex-col gap-2">
          <p className="text-xs text-white/40 mb-1">Weather at time of entry</p>
          <WeatherChip weather={entry.weather_snapshots} />
          <div className="mt-1 flex gap-4 text-xs text-white/35">
            <span>💧 {entry.weather_snapshots.humidity}% humidity</span>
            <span>☁️ {entry.weather_snapshots.cloud_cover_pct}% clouds</span>
            <span>🌡 {entry.weather_snapshots.pressure_hpa} hPa</span>
          </div>
        </div>
      )}

      {/* Reflection */}
      {entry.reflection && (
        <blockquote className="card px-5 py-4 text-sm leading-relaxed text-white/75 italic border-l-2 border-atmosphere-day/30">
          "{entry.reflection}"
        </blockquote>
      )}

      {/* Edit */}
      <div className="card px-5 py-5 flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Edit entry</p>
        <EditEntryForm entry={entry} />
        <div className="border-t border-white/[0.06] pt-4">
          <DeleteEntryButton id={entry.id} />
        </div>
      </div>
    </section>
  );
}

function Score({ label, value, color }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-white/40">{label}</span>
      <span className="text-5xl font-bold" style={{ color }}>{value}</span>
      <span className="text-xs text-white/20">out of 10</span>
    </div>
  );
}
