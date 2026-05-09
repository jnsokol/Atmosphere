"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveEntry } from "@/server/actions/save-entry";
import { MapPin } from "lucide-react";

const MOOD_LABELS  = ["", "Terrible", "Very bad", "Bad", "Low", "Neutral", "Okay", "Good", "Great", "Excellent", "Amazing"];
const ENERGY_LABELS = ["", "Exhausted", "Drained", "Tired", "Low", "Moderate", "Alert", "Focused", "Energised", "Pumped", "On fire"];

export default function MoodForm() {
  const router = useRouter();
  const [mood, setMood]             = useState(5);
  const [energy, setEnergy]         = useState(5);
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
    setPending(true); setError(null);
    const result = await saveEntry({ mood, energy, reflection: reflection || undefined, latitude: location?.lat, longitude: location?.lon });
    setPending(false);
    if (result.error) setError(result.error);
    else router.push("/history");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">

      <SliderField
        label="Mood"
        value={mood}
        onChange={setMood}
        sublabel={MOOD_LABELS[mood]}
        color="rgb(124,185,232)"
      />

      <SliderField
        label="Energy"
        value={energy}
        onChange={setEnergy}
        sublabel={ENERGY_LABELS[energy]}
        color="rgb(155,107,158)"
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <label className="text-sm font-medium text-white/70">Reflection</label>
          <span className="text-xs text-white/25">{reflection.length}/2000</span>
        </div>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="What's on your mind? (optional)"
          className="input resize-none"
        />
      </div>

      {/* Location status */}
      <div className="flex items-center gap-2 text-xs">
        <MapPin size={12} className={locStatus === "granted" ? "text-green-400" : "text-white/25"} />
        <span className={locStatus === "granted" ? "text-green-400/80" : "text-white/25"}>
          {locStatus === "loading"  && "Detecting location…"}
          {locStatus === "granted"  && "Location captured — weather will be logged"}
          {locStatus === "denied"   && "No location — entry saved without weather"}
          {locStatus === "idle"     && ""}
        </span>
      </div>

      {error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}

      <button type="submit" disabled={pending} className="btn-primary w-full py-3 text-base">
        {pending ? "Saving…" : "Save entry"}
      </button>
    </form>
  );
}

function SliderField({ label, value, onChange, sublabel, color }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-white/70">{label}</label>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-white/40">{sublabel}</span>
          <span className="text-3xl font-bold" style={{ color }}>{value}</span>
        </div>
      </div>
      <input type="range" min={1} max={10} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <div className="flex justify-between text-xs text-white/20">
        <span>1</span><span>5</span><span>10</span>
      </div>
    </div>
  );
}
