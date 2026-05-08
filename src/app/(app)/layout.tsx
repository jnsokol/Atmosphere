import Link from "next/link";

// TODO M1: redirect to /login if no Supabase session.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <nav className="mb-8 flex gap-6 text-sm text-white/70">
        <Link href="/log">Log</Link>
        <Link href="/history">History</Link>
        <Link href="/insights">Insights</Link>
      </nav>
      {children}
    </div>
  );
}
