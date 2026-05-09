"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { fetchCurrentWeather } from "@/lib/weather";

const SaveEntryInput = z.object({
  mood: z.number().int().min(1).max(10),
  energy: z.number().int().min(1).max(10),
  stress: z.number().int().min(1).max(10).optional(),
  reflection: z.string().max(2000).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export async function saveEntry(input) {
  const { latitude, longitude, ...entryData } = SaveEntryInput.parse(input);
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated" };

  const { data: entry, error } = await supabase
    .from("mood_entries")
    .insert({ user_id: user.id, latitude, longitude, ...entryData })
    .select()
    .single();

  if (error) return { error: error.message };

  // Weather enrichment — must not block or fail the entry save
  if (latitude != null && longitude != null) {
    const weather = await fetchCurrentWeather(latitude, longitude);
    if (weather) {
      await supabase.from("weather_snapshots").insert({
        entry_id: entry.id,
        temp_c: weather.tempC,
        humidity: weather.humidity,
        pressure_hpa: weather.pressureHpa,
        cloud_cover_pct: weather.cloudCoverPct,
        condition: weather.condition,
      });
    }
  }

  // TODO M4: fetch Spotify recently played and insert track_plays (must not block)

  revalidatePath("/history");
  return { ok: true, entry };
}

export async function updateEntry(id, input) {
  const data = SaveEntryInput.omit({ latitude: true, longitude: true }).partial().parse(input);
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: entry, error } = await supabase
    .from("mood_entries")
    .update(data)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/history");
  revalidatePath(`/entries/${id}`);
  return { ok: true, entry };
}

export async function deleteEntry(id) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("mood_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/history");
  return { ok: true };
}
