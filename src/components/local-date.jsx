"use client";

export default function LocalDate({ isoString, options, showTime = false }) {
  const date = new Date(isoString);
  const dateStr = date.toLocaleDateString("en-GB", options);
  if (!showTime) return <>{dateStr}</>;
  const timeStr = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return <>{dateStr} · {timeStr}</>;
}
