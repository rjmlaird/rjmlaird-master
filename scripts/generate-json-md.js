import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { globSync } from "glob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COLLECTIONS = [
  { key: "projects",    pattern: "../src/content/projects/**/*.md" },
  { key: "initiatives", pattern: "../src/content/initiatives/**/*.md" },
  { key: "caseStudies", pattern: "../src/content/case-studies/**/*.md" },
  { key: "authors",     pattern: "../src/content/authors/**/*.md" },
  { key: "blog",        pattern: "../src/content/blog/**/*.md" },
  { key: "events",      pattern: "../src/content/events/**/*.md" },
  { key: "videos",      pattern: "../src/content/videos/**/*.md" },
  { key: "podcasts",    pattern: "../src/content/podcasts/**/*.md" },
];

function parseCollection(pattern) {
  // Resolve relative to the script's directory (__dirname)
  const resolvedPattern = path.resolve(__dirname, pattern);
  const files = globSync(resolvedPattern);
  
  if (files.length === 0) {
    console.warn(`[Warning] No files matched pattern: ${pattern}`);
    return [];
  }

  return files.map((file) => {
    const raw = fs.readFileSync(file, "utf8");
    const { data, content } = matter(raw);

    return {
      slug: path.basename(file, ".md"),
      ...data,
      content,
      filePath: file,
    };
  });
}

// Ensure the target data directory exists
const outDir = path.resolve(__dirname, "../../rjmlaird-api/src/data");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Parse each collection and write out as a separate JSON file
for (const { key, pattern } of COLLECTIONS) {
  const items = parseCollection(pattern);
  
  const targetFile = path.join(outDir, `${key}.json`);
  fs.writeFileSync(
    targetFile,
    JSON.stringify(items, null, 2),
    "utf8"
  );
  
  console.log(`[Export] Wrote ${key}.json -> ${items.length} items found.`);
}