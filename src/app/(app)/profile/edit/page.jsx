import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ProfileForm from "@/components/profile-form";
import { ArrowLeft } from "lucide-react";

export default async function EditProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <section className="flex flex-col gap-6">
      <Link href="/profile" className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white w-fit transition-colors">
        <ArrowLeft size={14} /> Profile
      </Link>

      <div>
        <h1 className="text-2xl font-bold">Edit profile</h1>
        <p className="mt-1 text-xs text-white/35">Update your display name, bio, and avatar</p>
      </div>

      <div className="card px-5 py-5">
        <ProfileForm user={user} profile={profile} />
      </div>
    </section>
  );
}
