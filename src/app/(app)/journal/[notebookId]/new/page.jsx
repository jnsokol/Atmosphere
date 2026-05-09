import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createEntry } from "@/server/actions/journal";
import JournalEntryForm from "@/components/journal-entry-form";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function NewEntryPage({ params }) {
  const { notebookId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: notebook } = await supabase
    .from("notebooks").select("id, name, emoji").eq("id", notebookId).eq("user_id", user.id).single();

  if (!notebook) notFound();

  return (
    <section className="flex flex-col gap-6">
      <div>
        <Link href={`/journal/${notebookId}`} className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white w-fit transition-colors mb-4">
          <ArrowLeft size={14} /> {notebook.emoji} {notebook.name}
        </Link>
        <h1 className="text-2xl font-bold">New entry</h1>
      </div>
      <JournalEntryForm action={createEntry} notebookId={notebookId} />
    </section>
  );
}
