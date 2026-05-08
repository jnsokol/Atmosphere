"use client";

import { useState } from "react";
import { signIn, signUp, sendMagicLink } from "@/server/actions/auth";

export default function LoginPage() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup" | "magic"
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);

    const formData = new FormData(e.target);
    let result;

    if (mode === "signin") result = await signIn(formData);
    else if (mode === "signup") result = await signUp(formData);
    else result = await sendMagicLink(formData);

    setPending(false);
    if (result?.error) setError(result.error);
    if (result?.message) setMessage(result.message);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="mb-1 text-3xl font-semibold">Atmosphere</h1>
      <p className="mb-8 text-sm text-white/50">Track your mood. Find the patterns.</p>

      <div className="mb-6 flex gap-1 rounded-lg bg-white/10 p-1 text-sm">
        {[["signin", "Sign in"], ["signup", "Sign up"], ["magic", "Magic link"]].map(
          ([key, label]) => (
            <button
              key={key}
              onClick={() => { setMode(key); setError(null); setMessage(null); }}
              className={`flex-1 rounded-md py-1.5 font-medium transition-colors ${
                mode === key ? "bg-white text-atmosphere-night" : "text-white/70 hover:text-white"
              }`}
            >
              {label}
            </button>
          )
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded-md bg-white/10 px-4 py-2.5 text-sm placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30"
        />

        {mode !== "magic" && (
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            minLength={6}
            className="rounded-md bg-white/10 px-4 py-2.5 text-sm placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30"
          />
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}
        {message && <p className="text-sm text-green-400">{message}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-white py-2.5 text-sm font-medium text-atmosphere-night transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending
            ? "..."
            : mode === "signin"
            ? "Sign in"
            : mode === "signup"
            ? "Create account"
            : "Send magic link"}
        </button>
      </form>
    </main>
  );
}
