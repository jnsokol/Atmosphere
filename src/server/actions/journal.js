"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createNotebook(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const name  = formData.get("name")?.toString().trim();
  const emoji = formData.get("emoji")?.toString().trim() || "📓";
  if (!name) return;

  const { data, error } = await supabase
    .from("notebooks")
    .insert({ user_id: user.id, name, emoji })
    .select("id")
    .single();

  if (error) throw error;
  redirect(`/journal/${data.id}`);
}

export async function deleteNotebook(id) {
  const supabase = await createClient();
  await supabase.from("notebooks").delete().eq("id", id);
  redirect("/journal");
}

export async function createEntry(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const notebookId   = formData.get("notebookId")?.toString();
  const title        = formData.get("title")?.toString().trim() || null;
  const body         = formData.get("body")?.toString().trim() || null;
  const locationName = formData.get("locationName")?.toString().trim() || null;
  const latitude     = formData.get("latitude")  ? parseFloat(formData.get("latitude"))  : null;
  const longitude    = formData.get("longitude") ? parseFloat(formData.get("longitude")) : null;

  const { data, error } = await supabase
    .from("journal_entries")
    .insert({ notebook_id: notebookId, user_id: user.id, title, body, location_name: locationName, latitude, longitude })
    .select("id")
    .single();

  if (error) throw error;
  redirect(`/journal/${notebookId}/${data.id}`);
}

export async function updateEntry(formData) {
  const supabase = await createClient();

  const id           = formData.get("id")?.toString();
  const notebookId   = formData.get("notebookId")?.toString();
  const title        = formData.get("title")?.toString().trim() || null;
  const body         = formData.get("body")?.toString().trim() || null;
  const locationName = formData.get("locationName")?.toString().trim() || null;
  const latitude     = formData.get("latitude")  ? parseFloat(formData.get("latitude"))  : null;
  const longitude    = formData.get("longitude") ? parseFloat(formData.get("longitude")) : null;

  const { error } = await supabase
    .from("journal_entries")
    .update({ title, body, location_name: locationName, latitude, longitude })
    .eq("id", id);

  if (error) throw error;
  revalidatePath(`/journal/${notebookId}/${id}`);
  redirect(`/journal/${notebookId}/${id}`);
}

export async function deleteEntry(notebookId, entryId) {
  const supabase = await createClient();
  await supabase.from("journal_entries").delete().eq("id", entryId);
  revalidatePath(`/journal/${notebookId}`);
  redirect(`/journal/${notebookId}`);
}
