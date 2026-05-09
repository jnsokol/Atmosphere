import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: entries } = await supabase
    .from("mood_entries")
    .select("*, weather_snapshots(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, bio")
    .eq("user_id", user.id)
    .single();

  const payload = {
    exported_at: new Date().toISOString(),
    profile: profile ?? {},
    entries: entries ?? [],
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="atmosphere-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
