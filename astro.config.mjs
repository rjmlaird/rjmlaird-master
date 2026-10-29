import { defineConfig } from "astro/config";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import { rehypeTableAlign } from "./src/lib/rehype-table-align.mjs";
import { rehypeNormaliseHeadings } from "./src/lib/rehype-normalise-headings.mjs";
import { remarkGlossaryLinks } from "./packages/glossary/src/index.js";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { isEvidenceReady } from "./src/lib/content-quality.mjs";

// Keep stub pages (noindex in Layout) out of the sitemap too.
const stubUrls = new Set();
const sections = {
  projects: "projects",
  "case-studies": "case-studies",
  initiatives: "initiatives",
};

for (const [dir, route] of Object.entries(sections)) {
  const base = path.resolve("src/content", dir);
  if (!fs.existsSync(base)) continue;

  for (const f of fs.readdirSync(base).filter((x) => /\.mdx?$/.test(x))) {
    const { data, content } = matter(
      fs.readFileSync(path.join(base, f), "utf8")
    );
    const slug = data.slug ?? f.replace(/\.mdx?$/, "");
    if (!isEvidenceReady(data, content)) {
      stubUrls.add(`https://rjmlaird.co.uk/${route}/${slug}/`);
    }
  }
}

// /cv/ stays out of the sitemap until src/data/cv.json is marked complete.
// Draft or pre-launch sections stay out of the sitemap (their pages are also noindex).
const unindexed =
  /^https:\/\/rjmlaird\.co\.uk\/(insights\/resources\/.*|mentoring\/.+|coaching\/.*|tutoring\/.*|brand\/.*|research\/(lab|projects|methods|notebooks|notes|themes|outputs|data|data-policy|changelog|policy|accessibility)\/.*)$/;

const cv = JSON.parse(
  fs.readFileSync(path.resolve("src/data/cv.json"), "utf8")
);
if (!cv.complete) stubUrls.add("https://rjmlaird.co.uk/cv/");

// Check if local icons directory exists; if not, point icon integration elsewhere or omit local dir
const localIconsDir = path.resolve("src/icons");
const iconConfig = fs.existsSync(localIconsDir) ? {} : { include: {} };

export default defineConfig({
  vite: {
    resolve: { alias: { "@brand": path.resolve("./src/brand") } },
    ssr: { noExternal: ["@rjmlaird/policies"] }, // compile the package's TypeScript
  },

  site: "https://rjmlaird.co.uk",

  // Domain redirects
  redirects: {
    "/dev": "https://dev.rjmlaird.co.uk",
    "/cv": "https://cv.rjmlaird.co.uk",
  },

  // [term] and [term|text] in Markdown/MDX link to https://glossary.rjmlaird.co.uk/{slug}/.
  // Remark plugins need the unified processor (Astro 7 defaults to the Rust one); MDX inherits it.
  // Unknown references fail the build; set GLOSSARY_STRICT=0 to downgrade them to warnings.
  markdown: {
    processor: unified({
      remarkPlugins: [
        [
          remarkGlossaryLinks,
          { strict: process.env.GLOSSARY_STRICT !== "0" },
        ],
      ],
      rehypePlugins: [rehypeTableAlign, rehypeNormaliseHeadings],
    }),
  },

  scopedStyleStrategy: "class",

  integrations: [
    icon(iconConfig),
    sitemap({
      filter: (page) => !stubUrls.has(page) && !unindexed.test(page),
    }),
    mdx(),
  ],
});
