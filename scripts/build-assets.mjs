// Builds the static assets the site serves, from sources committed in the repo:
//   1. self-hosted font files, copied out of the @fontsource packages into public/fonts
//   2. the portrait crops: a warm-lit square for the hero medallion, and a 4:5 crop for About
// Run with `npm run assets`. Outputs are committed, so a deploy never depends on this script.
// The 3D app icons in public/media/3d were rendered from real brand paths with three.js.
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = (...p) => path.join(root, "public", ...p);
const asset = (...p) => path.join(root, "assets", ...p);
const mod = (...p) => path.join(root, "node_modules", ...p);

// ---------- 1. fonts ----------
const FONTS = [
  ["@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2", "outfit-latin.woff2"],
  ["@fontsource-variable/outfit/files/outfit-latin-ext-wght-normal.woff2", "outfit-latin-ext.woff2"],
  ["@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2", "plex-mono-latin-400.woff2"],
  ["@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2", "plex-mono-latin-500.woff2"],
  ["@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-ext-400-normal.woff2", "plex-mono-latin-ext-400.woff2"],
];

await mkdir(pub("fonts"), { recursive: true });
for (const [from, to] of FONTS) await copyFile(mod(from), pub("fonts", to));
console.log(`fonts: ${FONTS.length} files -> public/fonts`);

// ---------- 2. portrait ----------
await mkdir(pub("media"), { recursive: true });

// Hero medallion: head and shoulders, square, lit warm from the upper right like the rest of the site.
const SQUARE = { left: 70, top: 150, width: 800, height: 800 };
const glow = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900">
     <defs><radialGradient id="g" cx="80%" cy="28%" r="80%">
       <stop offset="0" stop-color="#ff8a3d" stop-opacity="0.9"/>
       <stop offset="0.55" stop-color="#7a2c0e" stop-opacity="0.55"/>
       <stop offset="1" stop-color="#1a0904" stop-opacity="0.95"/>
     </radialGradient></defs>
     <rect width="900" height="900" fill="url(#g)"/>
   </svg>`,
);
await sharp(asset("portrait.png"))
  .extract(SQUARE)
  .resize(900, 900)
  .composite([{ input: glow, blend: "soft-light" }])
  .modulate({ saturation: 1.06 })
  .webp({ quality: 82 })
  .toFile(pub("media", "portrait-warm.webp"));

// About: the plain photo at 4:5.
await sharp(asset("portrait.png"))
  .extract({ left: 60, top: 150, width: 820, height: 1025 })
  .resize(820, 1025)
  .webp({ quality: 80 })
  .toFile(pub("media", "portrait.webp"));

console.log("portrait: portrait-warm.webp (900x900), portrait.webp (820x1025)");
