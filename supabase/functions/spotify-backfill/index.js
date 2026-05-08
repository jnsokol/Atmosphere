// TODO M4: scheduled Edge Function. Picks up tracks where tempo_bpm IS NULL
// in batches of 100, calls /v1/audio-features, writes results back.
//
// Run on a Supabase cron schedule, e.g. "0 */6 * * *".

Deno.serve(async () => {
  return new Response(JSON.stringify({ todo: "M4: backfill audio features" }), {
    headers: { "content-type": "application/json" },
  });
});
