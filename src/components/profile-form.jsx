"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { saveProfile } from "@/server/actions/profile";

export default function ProfileForm({ user, profile }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const fileRef = useRef(null);

  const initials = (displayName || user.email).slice(0, 2).toUpperCase();

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
    const result = await saveProfile({ displayName, bio, avatarUrl });
    setSaving(false);
    if (result.error) {
      setStatus({ error: result.error });
    } else {
      router.push("/profile");
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">

      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <button type="button" onClick={() => fileRef.current?.click()} className="relative">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              width={96}
              height={96}
              className="rounded-full object-cover ring-2 ring-white/20"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-atmosphere-dusk text-3xl font-bold ring-2 ring-white/20">
              {initials}
            </div>
          )}
          <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm text-atmosphere-night shadow">
            {uploading ? "…" : "✏️"}
          </span>
        </button>
        <p className="text-xs text-white/40">Click to change photo</p>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
      </div>

      {/* Display name */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-white/70">Display name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          maxLength={40}
          placeholder={user.email.split("@")[0]}
          className="rounded-md bg-white/10 px-4 py-2.5 text-sm placeholder-white/30 outline-none focus:ring-2 focus:ring-white/30"
        />
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-white/70">Bio</label>
          <span className="text-xs text-white/30">{bio.length}/160</span>
        </div>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={160}
          rows={3}
          placeholder="Tell us a little about yourself…"
          className="resize-none rounded-md bg-white/10 px-4 py-3 text-sm placeholder-white/30 outline-none focus:ring-2 focus:ring-white/30"
        />
      </div>

      {status?.error && <p className="text-sm text-red-400">{status.error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-white py-2.5 text-sm font-medium text-atmosphere-night hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
