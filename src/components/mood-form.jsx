"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveEntry } from "@/server/actions/save-entry";

export default function MoodForm() {
  const router = useRouter();
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [reflection, setReflection] = useState("");
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);
  const [location, setLocation] = useState(null); // { lat, lon, label }
  const [locationStatus, setLocationStatus] = useState("idle"); // idle | loading | granted | denied

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocationStatus("granted");
      },
      () => setLocationStatus("denied")
    );
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const result = await saveEntry({
      mood,
      energy,
      reflection: reflection || undefined,
      latitude: location?.lat,
      longitude: location?.lon,
    });

    setPending(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/history");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <SliderField label="Mood" value={mood} onChange={setMood} lowLabel="Low" highLabel="High" />
      <SliderField label="Energy" value={energy} onChange={setEnergy} lowLabel="Drained" highLabel="Energised" />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-white/80">
          Reflection <span className="text-white/40">(optional)</span>
        </label>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="What's on your mind?"
          className="resize-none rounded-md bg-white/10 px-4 py-3 text-sm placeholder-white/30 outline-none focus:ring-2 focus:ring-white/30"
        />
      </div>

      <LocationStatus status={locationStatus} />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-white py-2.5 text-sm font-medium text-atmosphere-night transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save entry"}
      </button>
    </form>
  );
}

function LocationStatus({ status }) {
  if (status === "idle") return null;
  if (status === "loading") return <p className="text-xs text-white/40">Detecting location…</p>;
  if (status === "granted") return <p className="text-xs text-green-400/70">📍 Location captured for weather</p>;
  return <p className="text-xs text-white/40">Location unavailable — entry will be saved without weather</p>;
}

function SliderField({ label, value, onChange, lowLabel, highLabel }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-white/80">{label}</label>
        <span className="text-2xl font-semibold">{value}</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-white"
      />
      <div className="flex justify-between text-xs text-white/40">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
