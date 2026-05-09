"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [phase, setPhase] = useState("in"); // "in" | "hold" | "out" | "done"

  useEffect(() => {
    if (sessionStorage.getItem("atmosphere_splashed")) {
      setPhase("done");
      return;
    }

    const hold  = setTimeout(() => setPhase("out"),  1800);
    const done  = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem("atmosphere_splashed", "1");
    }, 2600);

    return () => { clearTimeout(hold); clearTimeout(done); };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-atmosphere-night"
      style={{
        opacity:    phase === "out" ? 0 : 1,
        transition: phase === "out" ? "opacity 0.6s ease" : "opacity 0.3s ease",
        pointerEvents: "none",
      }}
    >
      <div
        className="flex flex-col items-center gap-4"
        style={{
          opacity:   phase === "in" ? 0 : 1,
          transform: phase === "in" ? "scale(0.88)" : "scale(1)",
          transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Orb */}
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-atmosphere-day via-atmosphere-dusk to-atmosphere-dusk shadow-[0_0_40px_rgba(124,185,232,0.35)]" />
        {/* Wordmark */}
        <span
          className="font-display text-3xl font-bold tracking-tight bg-gradient-to-r from-atmosphere-day to-atmosphere-dusk bg-clip-text text-transparent"
        >
          Atmosphere
        </span>
      </div>
    </div>
  );
}
