import MoodForm from "@/components/mood-form";

export default function LogPage() {
  return (
    <section className="flex flex-col gap-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold">Check in</h1>
        <p className="mt-1 text-sm text-white/40">Tap a number to log how you feel right now.</p>
      </div>
      <MoodForm />
    </section>
  );
}
