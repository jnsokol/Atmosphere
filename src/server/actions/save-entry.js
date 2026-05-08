"use server";

import { z } from "zod";
// import { supabaseServer } from "@/lib/supabase/server";
// import { fetchCurrentWeather } from "@/lib/weather";
// import { fetchRecentlyPlayed } from "@/lib/spotify";

const SaveEntryInput = z.object({
  mood: z.number().int().min(1).max(10),
  energy: z.number().int().min(1).max(10),
  reflection: z.string().max(2000).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export async function saveEntry(input) {
  const data = SaveEntryInput.parse(input);

  // TODO M2: insert mood_entries row for auth.uid().
  // TODO M3: if lat/lon present, await fetchCurrentWeather and insert weather_snapshot.
  // TODO M4: if user has spotify_accounts row, await fetchRecentlyPlayed and insert track_plays.
  // Weather/Spotify failures must NOT roll back the entry.

  return { ok: true, data };
}
