import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/server/actions/auth";

export default async function AppLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <nav className="flex gap-6 text-sm text-white/70">
          <Link href="/dashboard" className="hover:text-white">Home</Link>
          <Link href="/log" className="hover:text-white">Log</Link>
          <Link href="/history" className="hover:text-white">History</Link>
          <Link href="/insights" className="hover:text-white">Insights</Link>
          <Link href="/profile" className="hover:text-white">Profile</Link>
        </nav>
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm text-white/50 hover:text-white"
          >
            Sign out
          </button>
        </form>
      </header>
      {children}
    </div>
  );
}
