import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6">
      <h1 className="text-5xl font-semibold tracking-tight">Atmosphere</h1>
      <p className="text-lg text-white/70">
        A mood tracker that listens to the weather and the music behind your
        days, then shows you the patterns you couldn't see.
      </p>
      <Link
        href="/login"
        className="w-fit rounded-md bg-white px-4 py-2 text-sm font-medium text-atmosphere-night hover:bg-white/90"
      >
        Get started
      </Link>
    </main>
  );
}
