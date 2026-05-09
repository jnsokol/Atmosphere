"use client";

import { useState } from "react";
import { updateEntry } from "@/server/actions/save-entry";

const MOOD_LABELS   = ["", "Awful", "Bad", "Low", "Meh", "Okay", "Fine", "Good", "Great", "Amazing", "Perfect"];
const ENERGY_LABELS = ["", "Drained", "Tired", "Low", "Lazy", "Neutral", "Active", "Energised", "Pumped", "Vibrant", "On fire"];
const STRESS_LABELS = ["", "None", "Minimal", "Light", "Low", "Moderate", "Noticeable", "High", "Very high", "Intense", "Overwhelming"];

function getMoodColor(n) {
  if (n >= 8) return { bg: "bg-green-400/20",      text: "text-green-300",      ring: "ring-green-400/40"       };
  if (n >= 6) return { bg: "bg-atmosphere-day/20", text: "text-atmosphere-day", ring: "ring-atmosphere-day/40"  };
  if (n >= 4) return { bg: "bg-yellow-400/20",     text: "text-yellow-300",     ring: "ring-yellow-400/40"      };
  return             { bg: "bg-red-400/20",         text: "text-red-300",        ring: "ring-red-400/40"         };
}

function getEnergyColor(n) {
  if (n >= 8) return { bg: "bg-atmosphere-day/20",  text: "text-atmosphere-day", ring: "ring-atmosphere-day/40"  };
  if (n >= 6) return { bg: "bg-atmosphere-dusk/20", text: "text-purple-300",     ring: "ring-atmosphere-dusk/40" };
  if (n >= 4) return { bg: "bg-yellow-400/20",      text: "text-yellow-300",     ring: "ring-yellow-400/40"      };
  return             { bg: "bg-red-400/20",          text: "text-red-300",        ring: "ring-red-400/40"         };
}

function getStressColor(n) {
  if (n >= 8) return { bg: "bg-red-400/20",    text: "text-red-300",    ring: "ring-red-400/40"    };
  if (n >= 6) return { bg: "bg-orange-400/20", text: "text-orange-300", ring: "ring-orange-400/40" };
  if (n >= 4) return { bg: "bg-yellow-400/20", text: "text-yellow-300", ring: "ring-yellow-400/40" };
  return             { bg: "bg-green-400/20",  text: "text-green-300",  ring: "ring-green-400/40"  };
}

export default function EditEntryForm({ entry }) {
  const [mood, setMood]         = useState(entry.mood);
  const [energy, setEnergy]     = useState(entry.energy);
  const [stress, setStress]     = useState(entry.stress ?? null);
  const [reflection, setReflection] = useState(entry.reflection ?? "");
  const [status, setStatus]     = useState(null);
  const [pending, setPending]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    setStatus(null);
    const result = await updateEntry(entry.id, { mood, energy, stress: stress || undefined, reflection: reflection || undefined });
    setPending(false);
    setStatus(result.error ? { error: result.error } : { ok: "Saved." });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <NumberPicker label="Mood"   value={mood}   onChange={setMood}   labels={MOOD_LABELS}   colorFn={getMoodColor} />
      <NumberPicker label="Energy" value={energy} onChange={setEnergy} labels={ENERGY_LABELS} colorFn={getEnergyColor} />
      <NumberPicker label="Stress" value={stress} onChange={setStress} labels={STRESS_LABELS} colorFn={getStressColor} optional />

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/25">Reflection</span>
          <span className="text-xs text-white/20">{reflection.length}/2000</span>
        </div>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          maxLength={2000}
          rows={3}
          placeholder="Reflection (optional)"
          className="input resize-none text-sm"
        />
      </div>

      {status?.error && <p className="text-sm text-red-400">{status.error}</p>}
      {status?.ok    && <p className="text-sm text-green-400">{status.ok}</p>}

      <button type="submit" disabled={pending} className="btn-primary w-full py-2.5 text-sm disabled:opacity-50">
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

function NumberPicker({ label, value, onChange, labels, colorFn, optional }) {
  const c = value ? colorFn(value) : colorFn(5);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-white/25">{label}</span>
        {value ? (
          <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${c.bg}`}>
            <span className={`text-lg font-bold ${c.text}`}>{value}</span>
            <span className={`text-xs font-medium ${c.text} opacity-80`}>{labels[value]}</span>
          </div>
        ) : (
          <span className="text-xs text-white/20">{optional ? "Optional" : "Tap a number"}</span>
        )}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const active = n === value;
          const nc = colorFn(n);
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`flex h-11 w-full items-center justify-center rounded-2xl text-sm font-bold transition-all duration-150 active:scale-95 ${
                active
                  ? `${nc.bg} ${nc.text} ring-1 ${nc.ring} scale-105`
                  : "bg-white/[0.04] text-white/25 hover:bg-white/[0.08] hover:text-white/50"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
