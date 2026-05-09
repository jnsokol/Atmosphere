import sharp from "sharp";
import { mkdirSync } from "fs";

mkdirSync("public/icons", { recursive: true });

const svg = (size) => {
  const r = size * 0.5;
  const cx = size * 0.5;
  const cy = size * 0.5;
  const radius = size * 0.42;
  const cornerRadius = size * 0.22;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <!-- Dark background -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e1020"/>
      <stop offset="100%" stop-color="#0b0d18"/>
    </linearGradient>

    <!-- Main sphere gradient: blue-grey top-left → purple bottom-right -->
    <radialGradient id="sphereMain" cx="38%" cy="32%" r="65%" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#9aafd4"/>
      <stop offset="35%"  stop-color="#8a9ec8"/>
      <stop offset="65%"  stop-color="#836aab"/>
      <stop offset="100%" stop-color="#7040a0"/>
    </radialGradient>

    <!-- Purple hotspot bottom-right -->
    <radialGradient id="spherePurple" cx="80%" cy="78%" r="55%" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#b055b0" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#7040a0" stop-opacity="0"/>
    </radialGradient>

    <!-- Subtle highlight top-left -->
    <radialGradient id="sphereHighlight" cx="28%" cy="22%" r="40%" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#c0d0f0" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#c0d0f0" stop-opacity="0"/>
    </radialGradient>

    <clipPath id="iconShape">
      <rect width="${size}" height="${size}" rx="${cornerRadius}" ry="${cornerRadius}"/>
    </clipPath>
    <clipPath id="circleClip">
      <circle cx="${cx}" cy="${cy}" r="${radius}"/>
    </clipPath>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${cornerRadius}" fill="url(#bgGrad)"/>

  <!-- Sphere layers clipped to circle -->
  <g clip-path="url(#circleClip)">
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="url(#sphereMain)"/>
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="url(#spherePurple)"/>
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="url(#sphereHighlight)"/>
  </g>
</svg>`;
};

await sharp(Buffer.from(svg(512))).png().toFile("public/icons/icon-512.png");
await sharp(Buffer.from(svg(192))).png().toFile("public/icons/icon-192.png");
await sharp(Buffer.from(svg(180))).png().toFile("public/icons/apple-touch-icon.png");
await sharp(Buffer.from(svg(32))).png().toFile("public/favicon.ico");
await sharp(Buffer.from(svg(32))).png().toFile("public/favicon.png");

console.log("Icons generated.");
