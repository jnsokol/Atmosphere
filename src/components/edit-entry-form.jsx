"use client";

import { useState } from "react";
import { updateEntry } from "@/server/actions/save-entry";

export default function EditEntryForm({ entry }) {
  const [mood, setMood] = useState(entry.mood);
  const [energy, setEnergy] = useState(entry.energy);
  const [reflection, setReflection] = useState(entry.reflection ?? "");
  const [status, setStatus] = useState(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    setStatus(null);
    const result = await updateEntry(entry.id, { mood, energy, reflection: reflection || undefined });
    setPending(false);
    setStatus(result.error ? { error: result.error } : { ok: "Saved." });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-6">
        <InlineSlider label="Mood" value={mood} onChange={setMood} />
        <InlineSlider label="Energy" value={energy} onChange={setEnergy} />
      </div>
      <textarea
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        maxLength={2000}
        rows={3}
        placeholder="Reflection (optional)"
        className="resize-none rounded-md bg-white/10 px-4 py-3 text-sm placeholder-white/30 outline-none focus:ring-2 focus:ring-white/30"
      />
      {status?.error && <p className="text-sm text-red-400">{status.error}</p>}
      {status?.ok && <p className="text-sm text-green-400">{status.ok}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-white/10 py-2 text-sm font-medium text-white hover:bg-white/20 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Update entry"}
      </button>
    </form>
  );
}

function InlineSlider({ label, value, onChange }) {
  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="flex justify-between text-xs text-white/50">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-white"
      />
    </div>
  );
}
