"use client";

import { useState, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";

export default function JournalEntryForm({ action, notebookId, entry }) {
  const [locationName, setLocationName] = useState(entry?.location_name ?? "");
  const [lat, setLat] = useState(entry?.latitude ?? "");
  const [lon, setLon] = useState(entry?.longitude ?? "");
  const [locating, setLocating] = useState(false);
  const [pending, setPending] = useState(false);

  async function detectLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        setLat(coords.latitude);
        setLon(coords.longitude);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
          );
          const data = await res.json();
          const name =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            data.display_name?.split(",")[0] ||
            "Current location";
          setLocationName(name);
        } catch {
          setLocationName("Current location");
        }
        setLocating(false);
      },
      () => setLocating(false)
    );
  }

  return (
    <form
      action={action}
      onSubmit={() => setPending(true)}
      className="flex flex-col gap-5"
    >
      <input type="hidden" name="notebookId" value={notebookId} />
      {entry && <input type="hidden" name="id" value={entry.id} />}
      <input type="hidden" name="latitude"  value={lat} />
      <input type="hidden" name="longitude" value={lon} />

      {/* Title */}
      <input
        name="title"
        placeholder="Title (optional)"
        defaultValue={entry?.title ?? ""}
        className="input text-base font-semibold"
      />

      {/* Body */}
      <textarea
        name="body"
        placeholder="Write your thoughts…"
        defaultValue={entry?.body ?? ""}
        rows={10}
        className="input resize-none leading-relaxed"
      />

      {/* Location */}
      <div className="flex gap-2 items-center">
        <input
          name="locationName"
          placeholder="Location (optional)"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          className="input flex-1"
        />
        <button
          type="button"
          onClick={detectLocation}
          disabled={locating}
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.05] text-white/40 hover:text-white hover:border-white/20 transition-all"
          title="Use my location"
        >
          {locating ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
        </button>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary mt-2"
      >
        {pending ? "Saving…" : entry ? "Save changes" : "Save entry"}
      </button>
    </form>
  );
}
