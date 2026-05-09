import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/server/actions/auth";
import BottomNav from "@/components/bottom-nav";
import InstallPrompt from "@/components/install-prompt";

export default async function AppLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/[0.05] bg-atmosphere-night/75 px-5 py-3.5 backdrop-blur-2xl">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          {/* Gradient orb */}
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-atmosphere-day via-atmosphere-dusk to-atmosphere-dusk opacity-90 shadow-glow-sm" />
          <span className="font-display text-[17px] font-bold tracking-tight bg-gradient-to-r from-atmosphere-day to-atmosphere-dusk bg-clip-text text-transparent">
            Atmosphere
          </span>
        </Link>

        <form action={signOut}>
          <button
            type="submit"
            className="rounded-full border border-white/[0.08] px-3 py-1.5 text-xs text-white/30 transition-all hover:border-white/15 hover:text-white/60"
          >
            Sign out
          </button>
        </form>
      </header>

      {/* Page content */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-8 pb-28 animate-fade-in">
        {children}
      </main>

      <BottomNav />
      <InstallPrompt />
    </div>
  );
}
