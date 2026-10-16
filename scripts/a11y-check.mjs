// scripts/a11y-check.mjs
// Runs axe-core (WCAG 2.0/2.1/2.2 A+AA and best-practice rules) against the built site
// at mobile and desktop widths, and fails if any page has violations.
//
// One-off setup (kept out of package.json so the lockfile is untouched):
//   pnpm add -D playwright axe-core && pnpm exec playwright install chromium
// Usage:
//   pnpm build && pnpm audit:a11y            # default pages
//   PAGES=/,/contact/ pnpm audit:a11y        # custom list

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = await import("playwright");
const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const DIST = path.resolve("dist");
const PAGES = (process.env.PAGES ?? "/,/services/,/about/,/insights/blog/").split(",");
const WIDTHS = [375, 1280];
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2" };

const server = http.createServer((req, res) => {
  let p = path.join(DIST, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
  if (!fs.existsSync(p)) { res.writeHead(404); return res.end("Not found"); }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] ?? "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch();
let failures = 0;

for (const width of WIDTHS) {
  for (const url of PAGES) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    await page.goto(`http://localhost:${port}${url}`);
    await page.addStyleTag({ content: ".fade{opacity:1!important;transform:none!important}" });
    await page.addScriptTag({ content: axeSource });
    const { violations } = await page.evaluate(() =>
      axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } }),
    );
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    if (overflow) { failures++; console.log(`✗ ${width}px ${url}: horizontal scroll`); }
    if (violations.length) {
      failures += violations.length;
      console.log(`✗ ${width}px ${url}`);
      for (const v of violations) console.log(`    ${v.id} (${v.impact}) ×${v.nodes.length}: ${v.help}`);
    } else if (!overflow) console.log(`✓ ${width}px ${url}`);
    await page.close();
  }
}

await browser.close();
server.close();
process.exit(failures ? 1 : 0);
