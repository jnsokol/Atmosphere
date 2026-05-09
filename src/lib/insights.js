import { pearson, meanBy } from "@/lib/correlation";

const MIN_N = 10;
const MIN_N_CORRELATION = 20;

/**
 * Takes raw joined rows (mood_entries + weather_snapshots) and returns
 * chart datasets + text insights. Runs server-side only.
 */
export function computeInsights(rows) {
  const withWeather = rows.filter((r) => r.weather_snapshots);

  return {
    charts: {
      moodOverTime: buildMoodOverTime(rows),
      moodByWeekday: buildMoodByWeekday(rows),
      moodVsPressure: buildMoodVsPressure(withWeather),
      moodVsCloudCover: buildMoodVsCloudCover(withWeather),
      moodVsTemperature: buildMoodVsTemperature(withWeather),
      moodByTimeOfDay: buildMoodByTimeOfDay(rows),
      moodByWeatherCondition: buildMoodByWeatherCondition(withWeather),
      moodVsEnergy: buildMoodVsEnergy(rows),
    },
    insights: generateInsights(rows, withWeather),
  };
}

function buildMoodOverTime(rows) {
  return rows
    .slice()
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map((r) => ({
      date: new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      mood: r.mood,
      energy: r.energy,
      stress: r.stress ?? null,
    }));
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildMoodByWeekday(rows) {
  const buckets = DAYS.map((d) => ({ day: d, moods: [], energies: [], stresses: [] }));
  rows.forEach((r) => {
    const dow = new Date(r.created_at).getDay();
    buckets[dow].moods.push(r.mood);
    if (r.energy != null) buckets[dow].energies.push(r.energy);
    if (r.stress != null) buckets[dow].stresses.push(r.stress);
  });
  return buckets.map(({ day, moods, energies, stresses }) => ({
    day,
    avg:       moods.length    ? +(moods.reduce((a, b) => a + b, 0)    / moods.length).toFixed(2)    : null,
    avgEnergy: energies.length ? +(energies.reduce((a, b) => a + b, 0) / energies.length).toFixed(2) : null,
    avgStress: stresses.length ? +(stresses.reduce((a, b) => a + b, 0) / stresses.length).toFixed(2) : null,
    n: moods.length,
  }));
}

function buildMoodVsPressure(rows) {
  return rows
    .filter((r) => r.weather_snapshots?.pressure_hpa != null)
    .map((r) => ({
      pressure: Math.round(r.weather_snapshots.pressure_hpa),
      mood: r.mood,
    }));
}

function buildMoodVsCloudCover(rows) {
  return rows
    .filter((r) => r.weather_snapshots?.cloud_cover_pct != null)
    .map((r) => ({
      cloud: r.weather_snapshots.cloud_cover_pct,
      mood: r.mood,
    }));
}

function buildMoodVsTemperature(rows) {
  return rows
    .filter((r) => r.weather_snapshots?.temp_c != null)
    .map((r) => ({
      temp: Math.round(r.weather_snapshots.temp_c),
      mood: r.mood,
    }));
}

const TIME_SLOTS = ["Morning", "Afternoon", "Evening", "Night"];

function getTimeSlot(hour) {
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  if (hour < 22) return "Evening";
  return "Night";
}

function buildMoodByTimeOfDay(rows) {
  const buckets = Object.fromEntries(TIME_SLOTS.map((s) => [s, { moods: [], energies: [], stresses: [] }]));
  rows.forEach((r) => {
    const hour = new Date(r.created_at).getHours();
    const slot = getTimeSlot(hour);
    buckets[slot].moods.push(r.mood);
    if (r.energy != null) buckets[slot].energies.push(r.energy);
    if (r.stress != null) buckets[slot].stresses.push(r.stress);
  });
  return TIME_SLOTS.map((slot) => {
    const { moods, energies, stresses } = buckets[slot];
    return {
      slot,
      avg:       moods.length    ? +(moods.reduce((a, b) => a + b, 0)    / moods.length).toFixed(2)    : null,
      avgEnergy: energies.length ? +(energies.reduce((a, b) => a + b, 0) / energies.length).toFixed(2) : null,
      avgStress: stresses.length ? +(stresses.reduce((a, b) => a + b, 0) / stresses.length).toFixed(2) : null,
      n: moods.length,
    };
  });
}

function buildMoodVsEnergy(rows) {
  return rows
    .filter((r) => r.mood != null && r.energy != null)
    .map((r) => ({ mood: r.mood, energy: r.energy }));
}

function normaliseCondition(desc) {
  if (!desc) return null;
  const d = desc.toLowerCase();
  if (d.includes("thunder")) return "Thunderstorm";
  if (d.includes("snow") || d.includes("sleet") || d.includes("blizzard")) return "Snow";
  if (d.includes("fog") || d.includes("mist") || d.includes("haze")) return "Fog";
  if (d.includes("drizzle") || d.includes("light rain")) return "Drizzle";
  if (d.includes("rain") || d.includes("shower")) return "Rain";
  if (d.includes("overcast")) return "Overcast";
  if (d.includes("cloudy") || d.includes("cloud")) return "Cloudy";
  if (d.includes("partly") || d.includes("partial")) return "Partly cloudy";
  if (d.includes("clear") || d.includes("sunny") || d.includes("fair")) return "Clear";
  return null;
}

function buildMoodByWeatherCondition(rows) {
  const buckets = {};
  rows.forEach((r) => {
    const cond = normaliseCondition(r.weather_snapshots?.description);
    if (!cond) return;
    if (!buckets[cond]) buckets[cond] = [];
    buckets[cond].push(r.mood);
  });
  return Object.entries(buckets)
    .filter(([, moods]) => moods.length >= 3)
    .map(([condition, moods]) => ({
      condition,
      avg: +(moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(2),
      n: moods.length,
    }))
    .sort((a, b) => b.avg - a.avg);
}

function generateInsights(rows, withWeather) {
  const insights = [];

  // Sunny vs cloudy
  const sunny = withWeather.filter((r) => r.weather_snapshots.cloud_cover_pct <= 30);
  const cloudy = withWeather.filter((r) => r.weather_snapshots.cloud_cover_pct >= 70);
  if (sunny.length >= MIN_N && cloudy.length >= MIN_N) {
    const sunnyMean = meanBy(sunny, (r) => r.mood);
    const cloudyMean = meanBy(cloudy, (r) => r.mood);
    const diff = sunnyMean - cloudyMean;
    if (Math.abs(diff) >= 0.5) {
      const pct = Math.round((Math.abs(diff) / cloudyMean) * 100);
      insights.push(
        diff > 0
          ? `Your mood averages ${pct}% higher on sunny days (n=${sunny.length}).`
          : `Your mood averages ${pct}% higher on cloudy days (n=${cloudy.length}).`
      );
    }
  }

  // Pressure correlation
  if (withWeather.length >= MIN_N_CORRELATION) {
    const moods = withWeather.map((r) => r.mood);
    const pressures = withWeather.map((r) => r.weather_snapshots.pressure_hpa);
    const r = pearson(moods, pressures);
    if (r < -0.3) {
      insights.push(`Lower air pressure correlates with lower mood (r=${r.toFixed(2)}, n=${withWeather.length}).`);
    } else if (r > 0.3) {
      insights.push(`Higher air pressure correlates with better mood (r=${r.toFixed(2)}, n=${withWeather.length}).`);
    }
  }

  // Best weekday
  if (rows.length >= MIN_N) {
    const byDay = DAYS.map((d, i) => {
      const dayRows = rows.filter((r) => new Date(r.created_at).getDay() === i);
      return { day: d, mean: dayRows.length >= 3 ? meanBy(dayRows, (r) => r.mood) : null };
    }).filter((d) => d.mean !== null);

    if (byDay.length >= 3) {
      const best = byDay.reduce((a, b) => (a.mean > b.mean ? a : b));
      const worst = byDay.reduce((a, b) => (a.mean < b.mean ? a : b));
      if (best.mean - worst.mean >= 1) {
        insights.push(`${best.day} is your best day on average (${best.mean.toFixed(1)}), ${worst.day} your lowest (${worst.mean.toFixed(1)}).`);
      }
    }
  }

  // Overall mood trend (first half vs second half)
  if (rows.length >= MIN_N) {
    const sorted = rows.slice().sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const mid = Math.floor(sorted.length / 2);
    const early = meanBy(sorted.slice(0, mid), (r) => r.mood);
    const recent = meanBy(sorted.slice(mid), (r) => r.mood);
    const diff = recent - early;
    if (Math.abs(diff) >= 0.5) {
      insights.push(
        diff > 0
          ? `Your mood has been trending upward recently (+${diff.toFixed(1)} vs your earlier entries).`
          : `Your mood has been trending downward recently (${diff.toFixed(1)} vs your earlier entries).`
      );
    }
  }

  return insights;
}
