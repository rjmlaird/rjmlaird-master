import { defineConfig } from "astro/config";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { isEvidenceReady } from "./src/lib/content-quality.mjs";

// Keep stub pages (noindex in Layout) out of the sitemap too.
const stubUrls = new Set();
const sections = { projects: "projects", "case-studies": "case-studies", initiatives: "initiatives" };
for (const [dir, route] of Object.entries(sections)) {
  const base = path.resolve("src/content", dir);
  if (!fs.existsSync(base)) continue;
  for (const f of fs.readdirSync(base).filter((x) => /\.mdx?$/.test(x))) {
    const { data, content } = matter(fs.readFileSync(path.join(base, f), "utf8"));
    const slug = data.slug ?? f.replace(/\.mdx?$/, "");
    if (!isEvidenceReady(data, content)) stubUrls.add(`https://rjmlaird.co.uk/${route}/${slug}/`);
  }
}

// /cv/ stays out of the sitemap until src/data/cv.json is marked complete.
const cv = JSON.parse(fs.readFileSync(path.resolve("src/data/cv.json"), "utf8"));
if (!cv.complete) stubUrls.add("https://rjmlaird.co.uk/cv/");

export default defineConfig({
  site: "https://rjmlaird.co.uk",
  scopedStyleStrategy: "class",
  integrations: [icon(), sitemap({ filter: (page) => !stubUrls.has(page) }), mdx()],
});
