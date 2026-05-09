"use client";

import { useMemo } from "react";

const GREETINGS = {
  morning: [
    "Good morning",
    "Rise and shine",
    "Morning!",
    "New day, new mood",
    "Hello, sunshine",
    "Start strong today",
  ],
  afternoon: [
    "Good afternoon",
    "Hope your day's going well",
    "How's your day treating you?",
    "Afternoon check-in",
    "Halfway through the day",
    "Keep the momentum",
  ],
  evening: [
    "Good evening",
    "How did today feel?",
    "Wind down time",
    "Evening, friend",
    "Day almost done",
    "Reflect on your day",
  ],
  night: [
    "Up late?",
    "Burning the midnight oil?",
    "Still going?",
    "Night owl mode",
    "Late-night check-in",
    "One last entry for today",
  ],
};

function pick(now) {
  const hour = now.getHours();
  const slot = hour < 12 ? "morning" : hour < 18 ? "afternoon" : hour < 22 ? "evening" : "night";
  const list = GREETINGS[slot];
  const day = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const slotIndex = ["morning", "afternoon", "evening", "night"].indexOf(slot);
  return list[(day * 4 + slotIndex) % list.length];
}

export default function Greeting() {
  const text = useMemo(() => pick(new Date()), []);
  return <p className="text-base text-white/35 leading-none">{text},</p>;
}
