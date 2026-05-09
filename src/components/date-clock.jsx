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
  const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="flex flex-col items-end">
      <span className="text-lg font-medium tabular-nums tracking-tight text-white/70">{timeStr}</span>
      <span className="text-xs text-white/30 mt-0.5">{dateStr}</span>
    </div>
  );
}
