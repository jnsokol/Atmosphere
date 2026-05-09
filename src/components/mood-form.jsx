"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveEntry } from "@/server/actions/save-entry";
import { MapPin } from "lucide-react";

const MOOD_LABELS   = ["", "Terrible", "Very bad", "Bad", "Low", "Neutral", "Okay", "Good", "Great", "Excellent", "Amazing"];
const ENERGY_LABELS = ["", "Exhausted", "Drained", "Tired", "Low", "Moderate", "Alert", "Focused", "Energised", "Pumped", "On fire"];

function getMoodColor(n) {
  if (n >= 8) return { bg: "bg-green-400/20",       text: "text-green-300",      ring: "ring-green-400/40",  glow: "shadow-green-400/20"  };
  if (n >= 6) return { bg: "bg-atmosphere-day/20",  text: "text-atmosphere-day", ring: "ring-atmosphere-day/40", glow: "shadow-atmosphere-day/20" };
  if (n >= 4) return { bg: "bg-yellow-400/20",      text: "text-yellow-300",     ring: "ring-yellow-400/40", glow: "shadow-yellow-400/20" };
  return              { bg: "bg-red-400/20",         text: "text-red-300",        ring: "ring-red-400/40",    glow: "shadow-red-400/20"    };
}

function getEnergyColor(n) {
  if (n >= 8) return { bg: "bg-atmosphere-day/20",  text: "text-atmosphere-day", ring: "ring-atmosphere-day/40",  glow: "shadow-atmosphere-day/20"  };
  if (n >= 6) return { bg: "bg-atmosphere-dusk/20", text: "text-purple-300",     ring: "ring-atmosphere-dusk/40", glow: "shadow-atmosphere-dusk/20" };
  if (n >= 4) return { bg: "bg-yellow-400/20",      text: "text-yellow-300",     ring: "ring-yellow-400/40",      glow: "shadow-yellow-400/20"      };
  return              { bg: "bg-red-400/20",         text: "text-red-300",        ring: "ring-red-400/40",         glow: "shadow-red-400/20"         };
}

export default function MoodForm() {
  const router = useRouter();
  const [mood, setMood]             = useState(null);
  const [energy, setEnergy]         = useState(null);
  const [reflection, setReflection] = useState("");
  const [error, setError]           = useState(null);
  const [pending, setPending]       = useState(false);
  const [location, setLocation]     = useState(null);
  const [locStatus, setLocStatus]   = useState("idle");

  useEffect(() => {
    if (!navigator.geolocation) { setLocStatus("denied"); return; }
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }); setLocStatus("granted"); },
      () => setLocStatus("denied")
    );
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!mood || !energy) return;
    setPending(true); setError(null);
    const result = await saveEntry({ mood, energy, reflection: reflection || undefined, latitude: location?.lat, longitude: location?.lon });
    setPending(false);
    if (result.error) setError(result.error);
    else router.push("/dashboard");
  }

  const canSubmit = mood !== null && energy !== null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Mood picker */}
      <PickerSection
        label="Mood"
        value={mood}
        onChange={setMood}
        labels={MOOD_LABELS}
        colorFn={getMoodColor}
      />

      {/* Energy picker */}
      <PickerSection
        label="Energy"
        value={energy}
        onChange={setEnergy}
        labels={ENERGY_LABELS}
        colorFn={getEnergyColor}
      />

      {/* Reflection */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-widest text-white/25">Reflection</label>
          <span className="text-xs text-white/20">{reflection.length}/2000</span>
        </div>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          maxLength={2000}
          rows={3}
          placeholder="What's on your mind? (optional)"
          className="input resize-none text-sm"
        />
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-xs">
        <MapPin size={12} className={locStatus === "granted" ? "text-green-400" : "text-white/20"} />
        <span className={locStatus === "granted" ? "text-green-400/70" : "text-white/25"}>
          {locStatus === "loading" && "Detecting location…"}
          {locStatus === "granted" && "Location captured — weather will be logged"}
          {locStatus === "denied"  && "No location — entry saved without weather"}
        </span>
      </div>

      {error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={pending || !canSubmit}
        className="btn-primary w-full py-3.5 text-sm disabled:opacity-30"
      >
        {pending ? "Saving…" : !canSubmit ? "Select mood & energy to continue" : "Save entry"}
      </button>
    </form>
  );
}

function PickerSection({ label, value, onChange, labels, colorFn }) {
  const selected = value ? colorFn(value) : null;

  return (
    <div className="card px-5 py-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/25">{label}</p>
        {value ? (
          <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${selected.bg}`}>
            <span className={`text-xl font-bold ${selected.text}`}>{value}</span>
            <span className={`text-xs font-medium ${selected.text} opacity-80`}>{labels[value]}</span>
          </div>
        ) : (
          <span className="text-xs text-white/20">Tap a number</span>
        )}
      </div>

      {/* Number grid */}
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const active = n === value;
          const c = colorFn(n);
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`flex h-12 w-full flex-col items-center justify-center rounded-2xl text-sm font-bold transition-all duration-150 active:scale-95 ${
                active
                  ? `${c.bg} ${c.text} ring-1 ${c.ring} scale-105 shadow-lg ${c.glow}`
                  : "bg-white/[0.04] text-white/25 hover:bg-white/[0.08] hover:text-white/50"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>

      {/* Scale hint */}
      <div className="flex justify-between px-0.5 text-[10px] text-white/15">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}
