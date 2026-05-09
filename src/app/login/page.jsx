"use client";

import { useState } from "react";
import { signIn, signUp, sendMagicLink } from "@/server/actions/auth";

const TABS = [
  { key: "signin", label: "Sign in" },
  { key: "signup", label: "Sign up" },
  { key: "magic",  label: "Magic link" },
];

export default function LoginPage() {
  const [mode, setMode]       = useState("signin");
  const [message, setMessage] = useState(null);
  const [error, setError]     = useState(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true); setError(null); setMessage(null);
    const fd = new FormData(e.target);
    let result;
    if (mode === "signin")     result = await signIn(fd);
    else if (mode === "signup") result = await signUp(fd);
    else                        result = await sendMagicLink(fd);
    setPending(false);
    if (result?.error)   setError(result.error);
    if (result?.message) setMessage(result.message);
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.07] text-2xl ring-1 ring-white/10">
            🌤️
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-white/40">Sign in to your Atmosphere account</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl bg-white/[0.05] p-1">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setMode(key); setError(null); setMessage(null); }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                mode === key
                  ? "bg-white text-atmosphere-night shadow"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input name="email" type="email" placeholder="Email address" required className="input" />
          {mode !== "magic" && (
            <input name="password" type="password" placeholder="Password" required minLength={6} className="input" />
          )}

          {error   && <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{error}</p>}
          {message && <p className="rounded-xl bg-green-500/10 px-4 py-2.5 text-sm text-green-400">{message}</p>}

          <button type="submit" disabled={pending} className="btn-primary mt-1 w-full py-3">
            {pending ? "…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send magic link"}
          </button>
        </form>
      </div>
    </main>
  );
}
