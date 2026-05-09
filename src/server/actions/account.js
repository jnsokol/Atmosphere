"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Delete all user data — cascades handle mood_entries, weather_snapshots,
  // track_plays, and profiles via ON DELETE CASCADE on auth.users FK.
  const { error } = await supabase.rpc("delete_user");
  if (error) return { error: error.message };

  redirect("/login");
}
