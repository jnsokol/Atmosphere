"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const SaveEntryInput = z.object({
  mood: z.number().int().min(1).max(10),
  energy: z.number().int().min(1).max(10),
  reflection: z.string().max(2000).optional(),
  // M3 will add latitude / longitude here
});

export async function saveEntry(input) {
  const data = SaveEntryInput.parse(input);
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated" };

  const { data: entry, error } = await supabase
    .from("mood_entries")
    .insert({ user_id: user.id, ...data })
    .select()
    .single();

  if (error) return { error: error.message };

  // TODO M3: fetch weather and insert weather_snapshot (must not block)
  // TODO M4: fetch Spotify recently played and insert track_plays (must not block)

  revalidatePath("/history");
  return { ok: true, entry };
}

export async function updateEntry(id, input) {
  const data = SaveEntryInput.partial().parse(input);
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
