import re, sys, json
from pathlib import Path

UP = Path("/mnt/user-data/uploads")
OUT = Path("/mnt/user-data/outputs/legal-refactor/src/pages")

LINK_KEYS = {
    "/privacy/": "privacy", "/cookies/": "cookies", "/terms-of-use/": "terms",
    "/accessibility/": "accessibility", "/disclaimer/": "disclaimer",
    "/security/": "security", "/.well-known/security.txt": "securityTxt",
    "/safeguarding/": "safeguarding", "/contact/": "contact",
    "{siteLegal.bookingUrl}": "booking",
}

def ident(k):  # object key literal + accessor
    ok = re.fullmatch(r"[A-Za-z_]\w*", k)
    return (k if ok else json.dumps(k)), (f".{k}" if ok else f'["{k}"]')

def migrate(name, extra):
    s = (UP / f"{name}.astro").read_text()
    used = set(); notes = []

    # ---- 1. sections array -> defineSections
    m = re.search(r"const sections = \[(.*?)\n\];", s, re.S)
    entries = re.findall(r'\{\s*id:\s*"([^"]+)",\s*label:\s*"([^"]+)"\s*\}', m.group(1))
    labels = dict(entries)
    body = ",\n".join(f"  {ident(i)[0]}: {json.dumps(l, ensure_ascii=False)}" for i, l in entries)
    s = s.replace(m.group(0), f"const s = defineSections({{\n{body},\n}});")
    s = s.replace("  {sections}\n", "  sections={s.list}\n")

    # ---- 2. section wrappers
    pat = re.compile(r'<section\s+id="([^"]+)"\s+aria-labelledby="\1-heading"\s*>\s*<h2 id="\1-heading">(.*?)</h2>', re.S)
    def sec(m):
        sid, title = m.group(1), " ".join(m.group(2).split())
        used.add("LegalSection")
        if sid not in labels: notes.append(f"section {sid} not in nav")
        t = "" if labels.get(sid) == title else f" title={json.dumps(title, ensure_ascii=False)}"
        if t: notes.append(f"title differs from nav label for {sid}: {title!r} vs {labels.get(sid)!r}")
        return f"<LegalSection section={{s.by{ident(sid)[1]}}}{t}>"
    s, n = pat.subn(sec, s)
    s = s.replace("</section>", "</LegalSection>")
    left = len(re.findall(r"<section\b", s))
    if left: notes.append(f"{left} <section> left unconverted")

    # ---- 3. in-page anchors
    def anchor(m):
        k = m.group(1)
        return f"href={{s.by{ident(k)[1]}.href}}" if k in labels else m.group(0)
    s = re.sub(r'href="#([a-z0-9-]+)"', anchor, s)

    # ---- 4. mailto -> <Mailto>
    s, k = re.subn(r"<a href=\{`mailto:\$\{([\w.]+)\}`\}>\s*\{\1\}\s*</a>", r"<Mailto email={\1} />", s)
    if k: used.add("Mailto")

    # ---- 5. address -> ContactBlock
    s, k1 = re.subn(r"<address>\s*\{siteLegal\.controllerName\}<br />\s*Email: <Mailto email=\{([\w.]+)\} />\s*</address>",
                    r"<ContactBlock name={siteLegal.controllerName} email={\1} />", s)
    s, k2 = re.subn(r'<address class="security-contact">\s*Security contact: <Mailto email=\{([\w.]+)\} />\s*</address>',
                    r'<ContactBlock variant="callout" label="Security contact" email={\1} />', s)
    s, k3 = re.subn(r"<address>\s*<Mailto email=\{([\w.]+)\} />\s*</address>",
                    r'<ContactBlock label="" email={\1} />', s)
    if k1 + k2 + k3: used.add("ContactBlock")
    for a in re.findall(r"<address[^>]*>.*?</address>", s, re.S):
        notes.append("address left as-is: " + " ".join(a.split())[:90])

    # ---- 6. dl.legal-list -> DefinitionList/Item
    def dl(m):
        inner = m.group(1)
        inner, k = re.subn(r"<div>\s*<dt>(.*?)</dt>\s*<dd>(.*?)</dd>\s*</div>",
                           lambda x: f'<DefinitionItem term={json.dumps(x.group(1).strip(), ensure_ascii=False)}>{x.group(2)}</DefinitionItem>',
                           inner, flags=re.S)
        used.update({"DefinitionList", "DefinitionItem"})
        return f"<DefinitionList>{inner}</DefinitionList>"
    s = re.sub(r'<dl class="legal-list">(.*?)</dl>', dl, s, flags=re.S)

    # ---- 7. ul over array -> ItemList
    s, k = re.subn(r"<ul>\s*\{\s*(\w+)\.map\(\((\w+)\) => \(\s*<li>\{\2\}</li>\s*\)\)\s*\}\s*</ul>",
                   r"<ItemList items={\1} />", s)
    if k: used.add("ItemList")
    s, k = re.subn(r'<ol class="response-steps">(.*?)</ol>',
                   r'<ItemList ordered variant="steps">\1</ItemList>', s, flags=re.S)
    if k: used.add("ItemList")

    # ---- 8. related links aside
    am = re.search(r'\n  <Fragment slot="aside">(.*?)</Fragment>\n', s, re.S)
    if am:
        hrefs = re.findall(r'<a href=("([^"]+)"|\{[^}]+\})>', am.group(1))
        keys = [LINK_KEYS.get(h[1] or h[0]) for h in hrefs]
        if all(keys):
            s = s.replace(am.group(0), "\n")
            s = s.replace("  sections={s.list}\n",
                          "  sections={s.list}\n  related={" + json.dumps(keys) + "}\n")
        else:
            notes.append(f"aside has unmapped links: {hrefs}")

    # ---- 9. author-only checklist
    s = s.replace('<Fragment slot="footer-note">\n    <p>\n      <strong>Before publishing:</strong>',
                  '<Fragment slot="draft-note">\n    <p>\n      <strong>Before publishing:</strong>')

    # ---- 10. page-specific tables / widgets
    extra_cols = extra(s, used, notes)
    s = extra_cols

    # ---- imports
    comp = "".join(f'import {c} from "../components/legal/{c}.astro";\n' for c in sorted(used))
    s = s.replace('import { siteLegal } from "../data/legal";',
                  'import { siteLegal } from "../data/legal";\nimport { defineSections } from "../lib/notice";\n' + comp.rstrip("\n"), 1)
    s = re.sub(r"\n{3,}", "\n\n", s)
    (OUT / f"{name}.astro").write_text(s)
    print(f"{name}: {n} sections, notes: {notes or 'none'}")

# ---------- per-page handlers ----------
def none(s, used, notes): return s

def strip_style(s):
    return re.sub(r"\n<style>.*?</style>\n?", "\n", s, flags=re.S)

def cookies(s, used, notes):
    s = s.replace('const preferenceLink = "#cookie-preferences";\n', "")
    s = s.replace("\n---\n\n<LegalNoticeLayout", '''
const cookieColumns = [
  { key: "category", label: "Category", width: "11%" },
  { key: "name", label: "Name or technology", width: "14%" },
  { key: "provider", label: "Provider", width: "15%" },
  { key: "purpose", label: "Purpose", width: "28%" },
  { key: "duration", label: "Duration", width: "12%" },
  { key: "consent", label: "Consent position", width: "20%" },
];
---

<LegalNoticeLayout''', 1)
    s, k = re.subn(r'<div class="cookie-table-wrap" tabindex="0">.*?</table>\s*</div>',
        '<DataTable caption="Cookie inventory" columns={cookieColumns} rows={cookieInventory} minWidth="78rem" />', s, flags=re.S)
    used.add("DataTable")
    # preference panel
    pm = re.search(r'<div class="cookie-preferences" id="cookie-preferences">\s*<h3>.*?</h3>\s*(<p>.*?</p>)\s*<button.*?</button>\s*(<p class="small-print">.*?</p>)\s*</div>', s, re.S)
    if pm:
        s = s.replace(pm.group(0), f'<CookiePreferences>\n        {pm.group(1)}\n\n        <Fragment slot="after">\n          {pm.group(2)}\n        </Fragment>\n      </CookiePreferences>')
        used.add("CookiePreferences")
    else: notes.append("cookie preference block not matched")
    return strip_style(s)

def privacy(s, used, notes):
    s = s.replace("\n---\n\n<LegalNoticeLayout", '''
const processingColumns = [
  { key: "activity", label: "Activity", width: "15%" },
  { key: "data", label: "Information used", width: "24%" },
  { key: "purposeAndBasis", label: "Purpose and lawful basis", width: "31%" },
  { key: "recipientsAndRetention", label: "Recipients and retention", width: "30%" },
];

const processingRows = processorRows.map((row) => ({
  activity: row.activity,
  data: row.data,
  purposeAndBasis: [
    { label: "Purpose", value: row.purpose },
    { label: "Lawful basis", value: row.lawfulBasis },
  ],
  recipientsAndRetention: [
    { label: "Recipients", value: row.recipients },
    { label: "Retention", value: row.retention },
  ],
}));
---

<LegalNoticeLayout''', 1)
    s, k = re.subn(r'<div class="processing-table-wrap" tabindex="0">.*?</table>\s*</div>',
        '<DataTable caption="Processing activities" columns={processingColumns} rows={processingRows} minWidth="68rem" />', s, flags=re.S)
    used.add("DataTable")
    return strip_style(s)

def security(s, used, notes):
    s = s.replace("\n---\n\n<LegalNoticeLayout", '''
const scopeColumns = [
  { key: "asset", label: "Asset", width: "20%" },
  { key: "address", label: "Address", width: "29%" },
  { key: "notes", label: "Scope notes", width: "51%" },
];

const scopeRows = inScope.map((item) => ({
  asset: item.asset,
  address: { href: item.address },
  notes: item.notes,
}));
---

<LegalNoticeLayout''', 1)
    s, k = re.subn(r'<div class="scope-table-wrap" tabindex="0">.*?</table>\s*</div>',
        '<DataTable caption="In-scope assets" columns={scopeColumns} rows={scopeRows} minWidth="52rem" />', s, flags=re.S)
    used.add("DataTable")
    return strip_style(s)

def accessibility(s, used, notes):
    m = re.search(r'<div class="limitations-table-wrap" tabindex="0">.*?</table>\s*</div>', s, re.S)
    rows = []
    for tr in re.findall(r"<tbody>(.*?)</tbody>", m.group(0), re.S)[0].split("</tr>")[:-1]:
        th = re.search(r"<th scope=\"row\">(.*?)</th>", tr, re.S).group(1)
        tds = [" ".join(t.split()) for t in re.findall(r"<td>(.*?)</td>", tr, re.S)]
        rows.append((" ".join(th.split()), *tds))
    keys = ["area", "limitation", "alternative", "action"]
    arr = "const knownLimitations = [\n" + "".join(
        "  {\n" + "".join(f"    {k}:\n      {json.dumps(v, ensure_ascii=False)},\n" for k, v in zip(keys, r)) + "  },\n"
        for r in rows) + "];\n\n"
    arr += '''const limitationColumns = [
  { key: "area", label: "Area", width: "15%" },
  { key: "limitation", label: "Potential limitation", width: "30%" },
  { key: "alternative", label: "Alternative or support", width: "30%" },
  { key: "action", label: "Planned action", width: "25%" },
];
'''
    s = s.replace(m.group(0), '<DataTable caption="Known limitations" columns={limitationColumns} rows={knownLimitations} minWidth="66rem" />')
    s = s.replace("\n---\n\n<LegalNoticeLayout", "\n" + arr + "---\n\n<LegalNoticeLayout", 1)
    used.add("DataTable")
    return strip_style(s)

for name, fn in [("accessibility", accessibility), ("cookies", cookies), ("privacy", privacy),
                 ("security", security), ("terms-of-use", none), ("disclaimer", none)]:
    migrate(name, fn)
