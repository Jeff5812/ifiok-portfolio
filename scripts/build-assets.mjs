// Builds the static assets the site serves, from sources committed in the repo:
//   1. self-hosted font files, copied out of the @fontsource packages into public/fonts
//   2. the portrait crops from assets/portrait.jpg: a square for the hero medallion, and a 4:5 crop for About
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
// assets/portrait.jpg is a 1254x1254 studio headshot on grey. Both crops get the same soft warm light from the
// upper right, so the grey backdrop sits in the site's palette. The face itself is not retouched.
await mkdir(pub("media"), { recursive: true });

const warmLight = (w, h) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
       <defs><radialGradient id="g" cx="78%" cy="25%" r="85%">
         <stop offset="0" stop-color="#ff9a5a" stop-opacity="0.55"/>
         <stop offset="0.6" stop-color="#8a3a14" stop-opacity="0.35"/>
         <stop offset="1" stop-color="#1a0904" stop-opacity="0.6"/>
       </radialGradient></defs>
       <rect width="${w}" height="${h}" fill="url(#g)"/>
     </svg>`,
  );

// Hero medallion: head and shoulders, square.
await sharp(asset("portrait.jpg"))
  .extract({ left: 67, top: 60, width: 1120, height: 1120 })
  .resize(1000, 1000, { kernel: "lanczos3" })
  .composite([{ input: warmLight(1000, 1000), blend: "soft-light" }])
  .webp({ quality: 86 })
  .toFile(pub("media", "portrait-warm.webp"));

// About: the full height at 4:5, at full resolution.
await sharp(asset("portrait.jpg"))
  .extract({ left: 125, top: 0, width: 1003, height: 1254 })
  .composite([{ input: warmLight(1003, 1254), blend: "soft-light" }])
  .webp({ quality: 86 })
  .toFile(pub("media", "portrait.webp"));

console.log("portrait: portrait-warm.webp (1000x1000), portrait.webp (1003x1254)");
