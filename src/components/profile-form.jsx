"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { saveProfile } from "@/server/actions/profile";

export default function ProfileForm({ user, profile }) {
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const fileRef = useRef(null);

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("avatar", file);
    const res = await fetch("/api/profile/avatar", { method: "POST", body: formData });
    const json = await res.json();

    setUploading(false);
    if (json.url) setAvatarUrl(json.url);
    else setStatus({ error: json.error ?? "Upload failed" });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    const result = await saveProfile({ displayName, avatarUrl });
    setSaving(false);
    setStatus(result.error ? { error: result.error } : { ok: "Saved!" });
  }

  const initials = (displayName || user.email).slice(0, 2).toUpperCase();

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => fileRef.current?.click()} className="relative shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              width={72}
              height={72}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex h-18 w-18 items-center justify-center rounded-full bg-atmosphere-dusk text-xl font-bold">
              {initials}
            </div>
          )}
          <span className="absolute bottom-0 right-0 rounded-full bg-white px-1 text-xs text-atmosphere-night">
            {uploading ? "…" : "✏️"}
          </span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        <div className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{displayName || user.email.split("@")[0]}</span>
          <span className="text-xs text-white/40">{user.email}</span>
        </div>
      </div>

      {/* Display name */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-white/70">Display name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          maxLength={40}
          placeholder={user.email.split("@")[0]}
          className="rounded-md bg-white/10 px-4 py-2.5 text-sm placeholder-white/30 outline-none focus:ring-2 focus:ring-white/30"
        />
      </div>

      {status?.error && <p className="text-sm text-red-400">{status.error}</p>}
      {status?.ok && <p className="text-sm text-green-400">{status.ok}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-white py-2.5 text-sm font-medium text-atmosphere-night hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
