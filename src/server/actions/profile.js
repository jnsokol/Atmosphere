"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const ProfileInput = z.object({
  displayName: z.string().max(40).optional(),
  bio: z.string().max(160).optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export async function saveProfile(input) {
  const data = ProfileInput.parse(input);
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("profiles").upsert({
    user_id: user.id,
    display_name: data.displayName || null,
    bio: data.bio || null,
    avatar_url: data.avatarUrl || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  revalidatePath("/dashboard");
  return { ok: true };
}
