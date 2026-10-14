// Run after `astro build`: fails if unresolved drafting text reached dist/.
// package.json: "build": "astro build && node scripts/check-legal-todos.mjs"
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const pages = ["privacy", "cookies", "terms-of-use", "accessibility", "disclaimer", "security"];
const pattern = /TODO|Before publishing:/;
let failed = 0;

for (const page of pages) {
  const file = join("dist", page, "index.html");
  try { statSync(file); } catch { continue; }
  const text = readFileSync(file, "utf8").replace(/<[^>]+>/g, " ");
  const hits = text.split(/(?<=\.)\s/).filter((s) => pattern.test(s));
  if (hits.length) {
    failed += hits.length;
    console.error(`\n${page}: ${hits.length} unresolved`);
    hits.slice(0, 5).forEach((h) => console.error("  - " + h.trim().slice(0, 100)));
  }
}
if (failed) { console.error(`\n${failed} unresolved TODO(s) in legal pages.`); process.exit(1); }
console.log("Legal pages: no TODOs.");
