import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteAccountButton from "@/components/delete-account-button";

export default async function PrivacyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <section className="max-w-lg flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Privacy & Data</h1>

      <div className="flex flex-col gap-4 text-sm text-white/70 leading-relaxed">
        <p>
          Atmosphere stores the following data on your behalf in a Supabase (PostgreSQL) database:
        </p>
        <ul className="list-disc list-inside flex flex-col gap-1.5 text-white/60">
          <li>Mood entries — mood score, energy score, optional reflection text</li>
          <li>Weather snapshots — temperature, pressure, humidity, condition (fetched from OpenWeatherMap at the time of each entry)</li>
          <li>Profile — display name, bio, avatar image</li>
        </ul>
        <p>
          Your data is private. Row-Level Security (RLS) ensures only your account can read or modify your entries.
          No data is shared with third parties, sold, or used for advertising.
        </p>
        <p>
          Weather data is fetched using your device's GPS coordinates at the moment of logging.
          Coordinates are not stored — only the resulting weather snapshot is saved.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">Your data</h2>
        <a
          href="/api/export"
          className="rounded-md border border-white/20 px-4 py-2.5 text-sm text-white/70 hover:border-white/40 hover:text-white text-center"
        >
          Export all my data (JSON)
        </a>
        <DeleteAccountButton />
      </div>
    </section>
  );
}
