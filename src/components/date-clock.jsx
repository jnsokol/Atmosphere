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
    <div className="flex items-baseline gap-2.5 mt-2">
      <span className="text-3xl font-bold tabular-nums tracking-tight text-white/90">{timeStr}</span>
      <span className="text-sm text-white/30">{dateStr}</span>
    </div>
  );
}
