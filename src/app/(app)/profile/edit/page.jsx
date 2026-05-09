import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ProfileForm from "@/components/profile-form";

export default async function EditProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <section className="max-w-lg">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/profile" className="text-sm text-white/40 hover:text-white">← Profile</Link>
      </div>
      <h1 className="mb-6 text-2xl font-semibold">Edit profile</h1>
      <ProfileForm user={user} profile={profile} />
    </section>
  );
}
