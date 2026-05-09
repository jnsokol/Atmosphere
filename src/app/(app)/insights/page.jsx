import { createClient } from "@/lib/supabase/server";
import { computeInsights } from "@/lib/insights";
import MoodOverTimeChart from "@/components/charts/mood-over-time";
import MoodByWeekdayChart from "@/components/charts/mood-by-weekday";
import MoodVsPressureChart from "@/components/charts/mood-vs-pressure";
import MoodVsCloudChart from "@/components/charts/mood-vs-cloud";

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
      <section>
        <h1 className="mb-2 text-2xl font-semibold">Insights</h1>
        <p className="text-white/50">
          Log at least {MIN_ENTRIES} entries to unlock your insights dashboard.
        </p>
      </section>
    );
  }

  const { charts, insights } = computeInsights(rows);

  return (
    <section className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold">Insights</h1>
        <p className="mt-1 text-sm text-white/40">{rows.length} entries analysed</p>
      </div>

      {insights.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">Generated insights</h2>
          {insights.map((text, i) => (
            <div key={i} className="rounded-xl bg-white/5 px-5 py-4 text-sm leading-relaxed text-white/80">
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
    </section>
  );
}

function ChartSection({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">{title}</h2>
      <div className="rounded-xl bg-white/5 p-4">{children}</div>
    </div>
  );
}
