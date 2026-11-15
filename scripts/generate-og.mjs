/**
 * Generates public/og-image.png — the 1200x630 link-share card for social previews.
 *
 * Design: the site's own terminal aesthetic (token colours from src/styles/global.css).
 * Deliberately no portrait: the card is shared off-site, so no face leaves the repo.
 *
 * Regenerate after any change:  node scripts/generate-og.mjs
 * (sharp is already available as an Astro dependency; no install needed.)
 *
 * Rendered at 2x then resized down, so text stays crisp after librsvg rasterises it.
 * Font: Consolas — an OS-installed monospace. The site's webfonts (JetBrains Mono,
 * Press Start 2P) are npm packages, not system fonts, so librsvg cannot use them here.
 */
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = resolve(root, "public/og-image.png");

// Tokens copied from src/styles/global.css — keep in sync.
const COLORS = {
  canvas: "#05070a",
  surface: "#090d14",
  consoleHeader: "#0f172a",
  border: "#1e293b",
  textPrimary: "#e5e9f0",
  textSecondary: "#8b9bb4",
  accentBlue: "#2563eb",
  link: "#60a5fa",
};

const NAME = "Dwight Jairo C. Pingul";
const TITLE = "Backend &amp; Systems Software Engineer"; // XML-escaped for SVG
const GITHUB = "github.com/yatoyataro";
const PROMPT_CMD = "whoami";
const PROMPT_OUT = "~/portfolio_terminal $";

// Consolas advance width is ~0.55em; used only to place the block cursor after the name.
const nameWidth = Math.round(NAME.length * 64 * 0.55);

const svg = `
<svg width="2400" height="1260" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${COLORS.canvas}"/>

  <!-- terminal window frame -->
  <rect x="24" y="24" width="1152" height="582" fill="${COLORS.surface}" stroke="${COLORS.border}" stroke-width="2"/>

  <!-- title bar -->
  <rect x="24" y="24" width="1152" height="64" fill="${COLORS.consoleHeader}"/>
  <line x1="24" y1="88" x2="1176" y2="88" stroke="${COLORS.border}" stroke-width="2"/>
  <circle cx="56" cy="56" r="7" fill="${COLORS.border}"/>
  <circle cx="82" cy="56" r="7" fill="${COLORS.border}"/>
  <circle cx="108" cy="56" r="7" fill="${COLORS.border}"/>
  <text x="600" y="65" text-anchor="middle" font-family="Consolas, 'Courier New', monospace"
        font-size="26" fill="${COLORS.textSecondary}">dwight@portfolio_terminal: ~</text>

  <!-- prompt line -->
  <text x="72" y="212" font-family="Consolas, 'Courier New', monospace" font-size="36">
    <tspan fill="${COLORS.accentBlue}">&gt;</tspan><tspan fill="${COLORS.link}">_</tspan><tspan fill="${COLORS.textPrimary}" dx="18">${PROMPT_CMD}</tspan>
  </text>
  <text x="72" y="268" font-family="Consolas, 'Courier New', monospace" font-size="28" fill="${COLORS.textSecondary}">${PROMPT_OUT}</text>

  <!-- name + block cursor -->
  <text x="72" y="360" font-family="Consolas, 'Courier New', monospace" font-weight="bold"
        font-size="64" fill="${COLORS.textPrimary}">${NAME}</text>
  <rect x="${72 + nameWidth + 20}" y="308" width="30" height="60" fill="${COLORS.accentBlue}"/>

  <!-- title -->
  <rect x="72" y="392" width="6" height="40" fill="${COLORS.accentBlue}"/>
  <text x="94" y="422" font-family="Consolas, 'Courier New', monospace" font-size="30" fill="${COLORS.textSecondary}">${TITLE}</text>

  <!-- footer -->
  <line x1="72" y1="528" x2="1128" y2="528" stroke="${COLORS.border}" stroke-width="2"/>
  <text x="72" y="568" font-family="Consolas, 'Courier New', monospace" font-size="26" fill="${COLORS.link}">${GITHUB}</text>
  <text x="1128" y="568" text-anchor="end" font-family="Consolas, 'Courier New', monospace" font-size="26" fill="${COLORS.textSecondary}">OPEN_TO_OPPORTUNITIES</text>
</svg>`;

await mkdir(dirname(outFile), { recursive: true });
await sharp(Buffer.from(svg)).resize(1200, 630).png().toFile(outFile);

const meta = await sharp(outFile).metadata();
console.log(`wrote ${outFile} (${meta.width}x${meta.height}, ${meta.format})`);
