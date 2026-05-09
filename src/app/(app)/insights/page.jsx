import { createClient } from "@/lib/supabase/server";
import { computeInsights } from "@/lib/insights";
import MoodOverTimeChart from "@/components/charts/mood-over-time";
import MoodByWeekdayChart from "@/components/charts/mood-by-weekday";
import MoodVsPressureChart from "@/components/charts/mood-vs-pressure";
import MoodVsCloudChart from "@/components/charts/mood-vs-cloud";
import MoodVsTemperatureChart from "@/components/charts/mood-vs-temperature";
import MoodByHourChart from "@/components/charts/mood-by-hour";
import MoodByWeatherChart from "@/components/charts/mood-by-weather";

const MIN_ENTRIES = 5;

export default async function InsightsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: rows } = await supabase
    .from("mood_entries")
    .select("*, weather_snapshots(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(200);

  if (!rows || rows.length < MIN_ENTRIES) {
    return (
      <section className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <span className="text-5xl">🔭</span>
        <h1 className="text-xl font-bold">Not enough data yet</h1>
        <p className="text-sm text-white/40 max-w-xs">
          Log at least {MIN_ENTRIES} entries to unlock your personal insights.
        </p>
      </section>
    );
  }

  const { charts, insights } = computeInsights(rows);

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Insights</h1>
        <p className="mt-1 text-xs text-white/35">{rows.length} entries analysed</p>
      </div>

      {insights.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/25">Highlights</p>
          {insights.map((text, i) => (
            <div key={i} className="card px-5 py-4 text-sm leading-relaxed text-white/75">
              {text}
            </div>
          ))}
        </div>
      )}

      <ChartSection title="Mood over time">
        <MoodOverTimeChart data={charts.moodOverTime} />
      </ChartSection>

      <ChartSection title="Mood by weekday">
        <MoodByWeekdayChart data={charts.moodByWeekday} />
      </ChartSection>

      {charts.moodVsPressure.length >= 5 && (
        <ChartSection title="Mood vs. air pressure">
          <MoodVsPressureChart data={charts.moodVsPressure} />
        </ChartSection>
      )}

      {charts.moodVsCloudCover.length >= 5 && (
        <ChartSection title="Mood vs. cloud cover">
          <MoodVsCloudChart data={charts.moodVsCloudCover} />
        </ChartSection>
      )}

      <ChartSection title="Mood by time of day">
        <MoodByHourChart data={charts.moodByTimeOfDay} />
      </ChartSection>

      {charts.moodVsTemperature.length >= 5 && (
        <ChartSection title="Mood vs. temperature">
          <MoodVsTemperatureChart data={charts.moodVsTemperature} />
        </ChartSection>
      )}

      {charts.moodByWeatherCondition.length >= 2 && (
        <ChartSection title="Mood by weather condition">
          <MoodByWeatherChart data={charts.moodByWeatherCondition} />
        </ChartSection>
      )}
    </section>
  );
}

function ChartSection({ title, children }) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/25">{title}</p>
      <div className="card px-4 py-4">{children}</div>
    </div>
  );
}
