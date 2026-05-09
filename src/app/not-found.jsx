import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-6">
      <p className="text-5xl">🌫️</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-white/50">This page doesn't exist or was moved.</p>
      <Link
        href="/dashboard"
        className="mt-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-atmosphere-night hover:opacity-90"
      >
        Go home
      </Link>
    </main>
  );
}
