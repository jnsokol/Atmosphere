"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

function detectPlatform() {
  const ua = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isAndroid = /android/i.test(ua);
  const isSafari = /safari/i.test(ua) && !/chrome/i.test(ua);
  if (isIOS && isSafari) return "ios";
  if (isIOS) return "ios-other";
  if (isAndroid) return "android";
  return "desktop";
}

const STEPS = {
  ios: {
    title: "Add to your Home Screen",
    subtitle: "Open Atmosphere like a real app — no App Store needed.",
    steps: [
      { emoji: "1️⃣", text: 'Tap the Share button at the bottom of Safari (the box with an arrow pointing up)' },
      { emoji: "2️⃣", text: 'Scroll down and tap "Add to Home Screen"' },
      { emoji: "3️⃣", text: 'Tap "Add" in the top-right corner' },
    ],
    note: "Works on iPhone and iPad in Safari.",
  },
  "ios-other": {
    title: "Add to your Home Screen",
    subtitle: "Open this page in Safari to install Atmosphere.",
    steps: [
      { emoji: "1️⃣", text: "Copy this page's address from the address bar" },
      { emoji: "2️⃣", text: "Open Safari and paste the address" },
      { emoji: "3️⃣", text: 'Tap the Share button → "Add to Home Screen"' },
    ],
    note: "Installation requires Safari on iPhone or iPad.",
  },
  android: {
    title: "Add to your Home Screen",
    subtitle: "Install Atmosphere like a real app — fast and offline-ready.",
    steps: [
      { emoji: "1️⃣", text: 'Tap the three-dot menu (⋮) in the top-right corner of Chrome' },
      { emoji: "2️⃣", text: 'Tap "Add to Home screen"' },
      { emoji: "3️⃣", text: 'Tap "Add" to confirm' },
    ],
    note: "Works on Android phones and tablets.",
  },
  desktop: {
    title: "Install Atmosphere",
    subtitle: "Pin Atmosphere to your taskbar for instant access.",
    steps: [
      { emoji: "1️⃣", text: "Look for the install icon (⊕) in the address bar of your browser" },
      { emoji: "2️⃣", text: 'Click it and select "Install"' },
      { emoji: "3️⃣", text: "Atmosphere will open as a standalone window" },
    ],
    note: "Works in Chrome and Edge on Windows and Mac.",
  },
};

const STORAGE_KEY = "atmosphere_install_dismissed";
const SHOW_AGAIN_AFTER_DAYS = 14;

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Don't show if already installed as PWA
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (window.navigator.standalone) return; // iOS Safari standalone

    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const daysSince = (Date.now() - Number(dismissed)) / 86400000;
      if (daysSince < SHOW_AGAIN_AFTER_DAYS) return;
    }

    const p = detectPlatform();
    setPlatform(p);

    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  }

  if (!mounted || !visible || !platform) return null;

  const info = STEPS[platform];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0e1020] px-6 py-7 shadow-2xl"
        style={{ animation: "slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-atmosphere-day via-atmosphere-dusk to-atmosphere-dusk flex items-center justify-center text-xl shadow-glow-sm">
              🌤️
            </div>
            <div>
              <p className="text-[15px] font-bold leading-snug">{info.title}</p>
              <p className="text-xs text-white/40 mt-0.5 leading-snug max-w-[200px]">{info.subtitle}</p>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-white/40 hover:bg-white/10 hover:text-white transition-all"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-white/[0.06]" />

        {/* Steps */}
        <ol className="flex flex-col gap-4">
          {info.steps.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-xl leading-none mt-0.5">{s.emoji}</span>
              <p className="text-[15px] text-white/80 leading-snug">{s.text}</p>
            </li>
          ))}
        </ol>

        {/* Note */}
        <p className="mt-5 text-xs text-white/25 text-center">{info.note}</p>

        {/* Dismiss button */}
        <button
          onClick={dismiss}
          className="mt-5 w-full rounded-2xl bg-white/[0.06] py-3.5 text-sm font-semibold text-white/60 hover:bg-white/10 hover:text-white transition-all active:scale-95"
        >
          Got it, thanks!
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}
