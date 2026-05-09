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
    <form onSubmit={handleSave} className="flex flex-col gap-5">

      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <button type="button" onClick={() => fileRef.current?.click()} className="relative group">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              width={88}
              height={88}
              className="rounded-2xl object-cover ring-1 ring-white/10 group-hover:ring-white/25 transition-all"
            />
          ) : (
            <div className="flex h-[88px] w-[88px] items-center justify-center rounded-2xl bg-gradient-to-br from-atmosphere-day/30 to-atmosphere-dusk/30 text-2xl font-bold ring-1 ring-white/10 group-hover:ring-white/25 transition-all">
              {initials}
            </div>
          )}
          <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-atmosphere-night shadow ring-2 ring-atmosphere-night">
            {uploading ? "…" : "✏"}
          </span>
        </button>
        <p className="text-xs text-white/35">Tap to change photo</p>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
      </div>

      {/* Display name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-white/50">Display name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          maxLength={40}
          placeholder={user.email.split("@")[0]}
          className="input text-sm"
        />
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-medium text-white/50">Bio</label>
          <span className="text-xs text-white/25">{bio.length}/160</span>
        </div>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={160}
          rows={3}
          placeholder="Tell us a little about yourself…"
          className="input resize-none text-sm"
        />
      </div>

      {status?.error && <p className="text-sm text-red-400">{status.error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="btn-primary py-2.5 text-sm disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
