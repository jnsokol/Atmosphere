import { z } from "zod";

const OwmCurrentSchema = z.object({
  main: z.object({
    temp: z.number(),
    humidity: z.number(),
    pressure: z.number(),
  }),
  clouds: z.object({ all: z.number() }),
  weather: z.array(z.object({ main: z.string(), description: z.string() })).min(1),
});

/** Server-only. Never import from a 'use client' file. */
export async function fetchCurrentWeather(lat, lon) {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) throw new Error("OPENWEATHER_API_KEY is not set");

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    const parsed = OwmCurrentSchema.parse(await res.json());
    return {
      tempC: parsed.main.temp,
      humidity: parsed.main.humidity,
      pressureHpa: parsed.main.pressure,
      cloudCoverPct: parsed.clouds.all,
      condition: parsed.weather[0].main,
    };
  } catch {
    // Don't block entry creation on a flaky third party.
    return null;
  }
}
