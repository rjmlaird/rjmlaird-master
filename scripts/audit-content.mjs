// Usage: npm run audit:content
// Lists every project / case study / initiative with the reasons it is not yet evidence-ready.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { assessEntry } from "../src/lib/content-quality.mjs";

const root = path.resolve("src/content");
const rows = [];
for (const dir of ["case-studies", "projects", "initiatives"]) {
  for (const f of fs.readdirSync(path.join(root, dir)).filter((x) => /\.mdx?$/.test(x))) {
    const { data, content } = matter(fs.readFileSync(path.join(root, dir, f), "utf8"));
    if (data.draft) continue;
    rows.push({ dir, file: f, featured: !!data.featured, issues: assessEntry(data, content) });
  }
}
const ready = rows.filter((r) => r.issues.length === 0);
console.log(`Evidence-ready: ${ready.length} / ${rows.length}\n`);
for (const r of rows.filter((r) => r.issues.length)) {
  console.log(`${r.dir.padEnd(13)} ${r.file.padEnd(34)} ${r.featured ? "[featured] " : ""}${r.issues.join("; ")}`);
}
