"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";

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

const HINTS = {
  ios:       { line1: "Install Atmosphere",   line2: 'Tap Share → "Add to Home Screen"' },
  "ios-other":{ line1: "Install Atmosphere",  line2: "Open in Safari to install" },
  android:   { line1: "Install Atmosphere",   line2: 'Tap ⋮ → "Add to Home screen"' },
  desktop:   { line1: "Install Atmosphere",   line2: "Click ⊕ in your address bar" },
};

const STORAGE_KEY = "atmosphere_install_dismissed_v2";
const SHOW_AGAIN_AFTER_DAYS = 14;

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState(null);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (window.navigator.standalone) return;

    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const daysSince = (Date.now() - Number(dismissed)) / 86400000;
      if (daysSince < SHOW_AGAIN_AFTER_DAYS) return;
    }

    setPlatform(detectPlatform());
    const t = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  }

  if (!platform) return null;

  const { line1, line2 } = HINTS[platform];

  return (
    <div
      className="fixed bottom-20 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      aria-live="polite"
    >
      <div
        className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-white/10 bg-[#0e1020]/95 px-4 py-3 shadow-2xl backdrop-blur-xl transition-all duration-500"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
        }}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-atmosphere-day to-atmosphere-dusk text-base">
          <Download size={16} className="text-white" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-none">{line1}</p>
          <p className="mt-0.5 text-xs text-white/45 leading-snug">{line2}</p>
        </div>

        <button
          onClick={dismiss}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-white/40 hover:bg-white/10 hover:text-white transition-all"
          aria-label="Dismiss"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
