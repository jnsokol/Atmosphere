import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/server/actions/auth";
import BottomNav from "@/components/bottom-nav";
import Sidebar from "@/components/sidebar";
import InstallPrompt from "@/components/install-prompt";
import SplashScreen from "@/components/splash-screen";

export default async function AppLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Top bar — mobile only */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-white/[0.05] bg-atmosphere-night px-5 py-3.5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
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

      {/* Desktop sidebar */}
      <Sidebar />

      {/* Page content */}
      <main className="flex-1 px-5 py-8 pt-24 pb-28 md:ml-56 md:pt-10 md:pb-10">
        <div className="mx-auto w-full max-w-2xl animate-fade-in">
          {children}
        </div>
      </main>

      {/* Bottom nav — mobile only */}
      <div className="md:hidden">
        <BottomNav />
      </div>

      <InstallPrompt />
      <SplashScreen />
    </div>
  );
}
