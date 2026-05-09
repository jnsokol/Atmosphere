import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LocalDate from "@/components/local-date";
import { deleteEntry, updateEntry } from "@/server/actions/journal";
import JournalEntryForm from "@/components/journal-entry-form";
import { ArrowLeft, MapPin, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EntryPage({ params }) {
  const { notebookId, entryId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: notebook }, { data: entry }] = await Promise.all([
    supabase.from("notebooks").select("id, name, emoji").eq("id", notebookId).eq("user_id", user.id).single(),
    supabase.from("journal_entries").select("*").eq("id", entryId).eq("user_id", user.id).single(),
  ]);

  if (!notebook || !entry) notFound();


  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <Link href={`/journal/${notebookId}`} className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white w-fit transition-colors mb-4">
          <ArrowLeft size={14} /> {notebook.emoji} {notebook.name}
        </Link>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-white/30">
              <LocalDate isoString={entry.created_at} options={{ weekday: "long", day: "numeric", month: "long", year: "numeric" }} />
            </p>
            {entry.location_name && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={11} className="text-white/25 shrink-0" />
                <span className="text-xs text-white/30">{entry.location_name}</span>
              </div>
            )}
          </div>
          <form action={deleteEntry.bind(null, notebookId, entryId)}>
            <button type="submit" className="flex h-8 w-8 items-center justify-center rounded-full text-white/20 hover:text-red-400 transition-colors">
              <Trash2 size={15} />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/[0.05]" />

      {/* Edit form */}
      <JournalEntryForm action={updateEntry} notebookId={notebookId} entry={entry} />
    </section>
  );
}
