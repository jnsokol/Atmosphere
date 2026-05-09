"use client";

import { useState, useEffect } from "react";

export default function DateClock() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const dateStr = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.07]">
      <span className="text-sm font-semibold tabular-nums text-white/50">{timeStr}</span>
      <span className="text-white/20 text-xs">·</span>
      <span className="text-sm text-white/30">{dateStr}</span>
    </div>
  );
}
