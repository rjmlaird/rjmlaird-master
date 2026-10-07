// Audits the JSON-LD in dist/ after a build. Fails (exit 1) on errors; prints warnings.
//   npm run build && npm run audit:schema
// Checks per page: exactly one JSON-LD script, valid JSON, a @graph, unique @ids, every {"@id"} reference
// resolves inside the page, required nodes present, no placeholders or empty values, absolute URLs.
import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve("dist");
const SITE = "https://rjmlaird.co.uk";
const PLACEHOLDERS = ["your-user-id", "441234567890", "0000-0000-0000-0000", "XXXXXXXXXXX", "YourName", "example.com", "undefined", "[object Object]", "NaN"];
const errors = [];
const warnings = [];
let pages = 0;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });
}

function refs(node, found = []) {
  if (Array.isArray(node)) node.forEach((n) => refs(n, found));
  else if (node && typeof node === "object") {
    const keys = Object.keys(node);
    if (keys.length === 1 && keys[0] === "@id") found.push(node["@id"]);
    else Object.values(node).forEach((v) => refs(v, found));
  }
  return found;
}

function strings(node, out = []) {
  if (typeof node === "string") out.push(node);
  else if (Array.isArray(node)) node.forEach((n) => strings(n, out));
  else if (node && typeof node === "object") Object.values(node).forEach((v) => strings(v, out));
  return out;
}

for (const file of walk(DIST)) {
  const html = fs.readFileSync(file, "utf8");
  if (!/<html/i.test(html) || /http-equiv="refresh"/i.test(html)) continue; // redirects
  const rel = "/" + path.relative(DIST, file).replace(/index\.html$/, "").replace(/\\/g, "/");
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  pages++;
  const fail = (m) => errors.push(`${rel}  ${m}`);
  const warn = (m) => warnings.push(`${rel}  ${m}`);

  if (blocks.length !== 1) { fail(`expected 1 JSON-LD block, found ${blocks.length}`); continue; }
  let data;
  try { data = JSON.parse(blocks[0][1]); } catch (e) { fail(`invalid JSON: ${e.message}`); continue; }
  if (data["@context"] !== "https://schema.org") fail("missing @context");
  const graph = data["@graph"];
  if (!Array.isArray(graph)) { fail("no @graph"); continue; }

  const idsSeen = new Map();
  for (const n of graph) {
    if (!n["@type"]) fail(`node without @type (${n["@id"] ?? "no id"})`);
    if (n["@id"]) {
      if (idsSeen.has(n["@id"])) fail(`duplicate @id ${n["@id"]}`);
      idsSeen.set(n["@id"], n);
    }
  }
  for (const r of refs(graph)) if (!idsSeen.has(r)) fail(`dangling reference ${r}`);

  const types = graph.map((n) => [n["@type"]].flat()).flat();
  for (const need of ["Person", "WebSite", "ImageObject"]) if (!types.includes(need)) fail(`missing ${need}`);
  const page = graph.find((n) => n["@id"]?.endsWith("#webpage"));
  if (!page) fail("missing WebPage node");
  else {
    if (!page.url?.startsWith(SITE)) warn(`WebPage url not on ${SITE}: ${page.url}`);
    if (!page.name) fail("WebPage has no name");
    if (!page.description) warn("WebPage has no description");
    if (page.isPartOf?.["@id"] !== `${SITE}/#website`) fail("WebPage.isPartOf does not point at the WebSite");
    if (page.breadcrumb && !idsSeen.has(page.breadcrumb["@id"])) fail("breadcrumb reference missing");
  }
  for (const s of strings(graph)) {
    const hit = PLACEHOLDERS.find((p) => s.includes(p));
    if (hit) fail(`placeholder-like value "${hit}" in "${s.slice(0, 80)}"`);
  }
  const person = idsSeen.get(`${SITE}/#person`);
  if (person) {
    for (const k of ["name", "url", "jobTitle", "sameAs"]) if (!person[k]) fail(`Person.${k} missing`);
    if (/^\/(about|cv|contact|work-with-me|press)?\/?$/.test(rel) && !person.hasCredential) fail("full profile page lacks Person.hasCredential");
  }
}

console.log(`Audited ${pages} pages.`);
if (warnings.length) console.log(`\n${warnings.length} warning(s):\n  ` + [...new Set(warnings)].slice(0, 25).join("\n  "));
if (errors.length) {
  console.error(`\n${errors.length} error(s):\n  ` + errors.slice(0, 40).join("\n  "));
  process.exit(1);
}
console.log("Schema audit passed.");
