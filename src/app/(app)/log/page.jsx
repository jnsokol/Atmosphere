import MoodForm from "@/components/mood-form";

export default function LogPage() {
  return (
    <section className="max-w-lg">
      <h1 className="mb-6 text-2xl font-semibold">How are you right now?</h1>
      <MoodForm />
    </section>
  );
}
