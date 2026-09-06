/**
 * Screenshot fedeli: viewport reale (niente ritaglio della finestra), scroll
 * fino all'ancora chiesta e attesa perché le animazioni d'ingresso finiscano.
 *
 *   node shot.mjs <url> <file.png> [larghezza] [altezza] [#ancora] [stile]
 */
import { chromium } from "playwright-core";

const [url, file, w = "390", h = "844", anchor = "", style = ""] = process.argv.slice(2);

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({
  viewport: { width: +w, height: +h },
  deviceScaleFactor: 2,
  isMobile: +w < 600,
  hasTouch: +w < 600,
});

if (style) {
  await page.addInitScript((s) => {
    try { localStorage.setItem("ai-workshops:style", s); } catch {}
  }, style);
}

await page.goto(url, { waitUntil: "networkidle" });
if (style) {
  await page.evaluate((s) => (document.documentElement.dataset.style = s), style);
}
if (anchor) {
  await page.evaluate((a) => {
    document.querySelector(a)?.scrollIntoView({ behavior: "instant", block: "start" });
  }, anchor);
}
await page.waitForTimeout(1800);
await page.screenshot({ path: file });
await browser.close();
