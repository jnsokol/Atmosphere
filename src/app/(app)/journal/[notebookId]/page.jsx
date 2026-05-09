import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteNotebook } from "@/server/actions/journal";
import { ArrowLeft, Plus, MapPin, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";

export default async function NotebookPage({ params }) {
  const { notebookId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: notebook }, { data: entries }] = await Promise.all([
    supabase.from("notebooks").select("id, name, color").eq("id", notebookId).eq("user_id", user.id).single(),
    supabase.from("journal_entries").select("id, title, body, location_name, created_at").eq("notebook_id", notebookId).order("created_at", { ascending: false }),
  ]);

  if (!notebook) notFound();

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <Link href="/journal" className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white w-fit transition-colors mb-4">
          <ArrowLeft size={14} /> Journal
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full shrink-0" style={{ background: notebook.color }} />
            <div>
              <h1 className="text-2xl font-bold">{notebook.name}</h1>
              <p className="text-xs text-white/35 mt-0.5">{(entries ?? []).length} entries</p>
            </div>
          </div>
          <form action={deleteNotebook.bind(null, notebookId)}>
            <button type="submit" className="flex h-8 w-8 items-center justify-center rounded-full text-white/20 hover:text-red-400 transition-colors" title="Delete notebook">
              <Trash2 size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* New entry button */}
      <Link
        href={`/journal/${notebookId}/new`}
        className="flex items-center gap-3 rounded-2xl border border-dashed border-white/10 px-4 py-3.5 text-sm text-white/40 hover:border-white/20 hover:text-white/70 transition-all"
      >
        <Plus size={16} /> New entry
      </Link>

      {/* Entries */}
      {(entries ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <span className="text-4xl">✏️</span>
          <p className="text-white/40 text-sm">No entries yet. Write your first one.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {(entries ?? []).map((e) => (
            <Link
              key={e.id}
              href={`/journal/${notebookId}/${e.id}`}
              className="card px-4 py-4 hover:border-white/15 transition-all active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-sm leading-snug line-clamp-1">
                  {e.title || <span className="text-white/30 font-normal italic">Untitled</span>}
                </p>
                <span className="shrink-0 text-[10px] text-white/25">
                  {new Date(e.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
              {e.body && <p className="text-xs text-white/40 mt-1.5 line-clamp-2 leading-relaxed">{e.body}</p>}
              {e.location_name && (
                <div className="flex items-center gap-1 mt-2">
                  <MapPin size={10} className="text-white/25" />
                  <span className="text-[10px] text-white/25">{e.location_name}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
