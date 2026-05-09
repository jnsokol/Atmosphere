"use client";

import { useState } from "react";
import { updateEntry } from "@/server/actions/save-entry";

const MOOD_LABELS = ["", "Awful", "Bad", "Low", "Meh", "Okay", "Fine", "Good", "Great", "Amazing", "Perfect"];
const ENERGY_LABELS = ["", "Drained", "Tired", "Low", "Lazy", "Neutral", "Active", "Energised", "Pumped", "Vibrant", "On fire"];

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <InlineSlider label="Mood" value={mood} onChange={setMood} labelMap={MOOD_LABELS} color="#7cb9e8" />
      <InlineSlider label="Energy" value={energy} onChange={setEnergy} labelMap={ENERGY_LABELS} color="#9b6b9e" />
      <textarea
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        maxLength={2000}
        rows={3}
        placeholder="Reflection (optional)"
        className="input resize-none text-sm"
      />
      {status?.error && <p className="text-sm text-red-400">{status.error}</p>}
      {status?.ok && <p className="text-sm text-green-400">{status.ok}</p>}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary py-2.5 text-sm disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

function InlineSlider({ label, value, onChange, labelMap, color }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/50">{label}</span>
        <span className="text-sm font-semibold" style={{ color }}>{value} · {labelMap[value]}</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
