"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [phase, setPhase] = useState("in"); // "in" | "hold" | "logo-out" | "bg-out" | "done"

  useEffect(() => {
    if (sessionStorage.getItem("atmosphere_splashed")) {
      setPhase("done");
      return;
    }

    const t1 = setTimeout(() => setPhase("hold"),     50);   // trigger logo fade-in
    const t2 = setTimeout(() => setPhase("logo-out"), 1000); // logo fades out, bg stays solid
    const t3 = setTimeout(() => setPhase("bg-out"),   1400); // bg fades out
    const t4 = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem("atmosphere_splashed", "1");
    }, 1900);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  if (phase === "done") return null;

  const logoOpacity   = phase === "hold" ? 1 : 0;
  const bgOpacity     = phase === "bg-out" ? 0 : 1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-atmosphere-night"
      style={{
        opacity: bgOpacity,
        transition: phase === "bg-out" ? "opacity 0.7s ease" : "none",
        pointerEvents: "none",
      }}
    >
      <div
        className="flex flex-col items-center gap-4"
        style={{
          opacity:   logoOpacity,
          transform: phase === "in" ? "scale(0.88)" : "scale(1)",
          transition: "opacity 0.5s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-atmosphere-day via-atmosphere-dusk to-atmosphere-dusk shadow-[0_0_40px_rgba(124,185,232,0.35)]" />
        <span className="font-display text-3xl font-bold tracking-tight bg-gradient-to-r from-atmosphere-day to-atmosphere-dusk bg-clip-text text-transparent">
          Atmosphere
        </span>
      </div>
    </div>
  );
}
