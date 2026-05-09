"use client";

import { useEffect, useState } from "react";
import { AchievementRow } from "@/components/achievement-row";

const ACHIEVEMENT = {
  id: "app_installed",
  emoji: "📱",
  title: "All In",
  desc: "Install Atmosphere on your device",
};

export default function InstallAchievement({ serverUnlocked }) {
  const [unlocked, setUnlocked] = useState(serverUnlocked);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (isStandalone) setUnlocked(true);
  }, []);

  return <AchievementRow a={{ ...ACHIEVEMENT, unlocked }} />;
}
