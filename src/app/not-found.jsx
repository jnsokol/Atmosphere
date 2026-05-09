import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 text-center px-6">
      <span className="text-6xl">🌫️</span>
      <div>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="mt-1.5 text-sm text-white/40">This page doesn't exist or was moved.</p>
      </div>
      <Link href="/dashboard" className="btn-primary px-6 py-2.5 text-sm">
        Go home
      </Link>
    </main>
  );
}
