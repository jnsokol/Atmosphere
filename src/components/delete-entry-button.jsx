"use client";

import { useRouter } from "next/navigation";
import { deleteEntry } from "@/server/actions/save-entry";

export default function DeleteEntryButton({ id }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this entry? This can't be undone.")) return;
    const result = await deleteEntry(id);
    if (result.ok) router.push("/history");
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-md border border-red-500/30 py-2 text-sm text-red-400 hover:bg-red-500/10"
    >
      Delete entry
    </button>
  );
}
