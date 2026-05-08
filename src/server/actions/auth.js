"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (error) return { error: error.message };
  redirect("/log");
}

export async function signUp(formData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (error) return { error: error.message };
  return { message: "Check your email to confirm your account." };
}

export async function sendMagicLink(formData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: formData.get("email"),
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/log` },
  });
  if (error) return { error: error.message };
  return { message: "Magic link sent — check your email." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
