import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.07] text-3xl ring-1 ring-white/10">
        🌤️
      </div>
      <h1 className="mb-3 text-4xl font-bold tracking-tight">Atmosphere</h1>
      <p className="mb-10 max-w-sm text-base text-white/50 leading-relaxed">
        Track your mood. Capture the weather. Find the hidden patterns behind how you feel.
      </p>
      <Link href="/login" className="btn-primary text-base px-8 py-3">
        Get started
      </Link>
      <p className="mt-4 text-xs text-white/25">Free forever · No ads · Your data stays yours</p>
    </main>
  );
}
