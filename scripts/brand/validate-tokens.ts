import { aliasTarget, isAlias, loadAll, makeResolver, type Theme } from './lib/tokens';

const errors: string[] = [];
const warnings: string[] = [];
const { base, dark } = loadAll(errors);

const validators: Record<string, (v: any) => boolean> = {
  color: (v) => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v),
  dimension: (v) => typeof v === 'string' && /^-?\d*\.?\d+(rem|px|em)$/.test(v),
  number: (v) => typeof v === 'number',
  fontWeight: (v) => typeof v === 'number' && v >= 1 && v <= 1000,
  fontFamily: (v) => Array.isArray(v) && v.length > 0 && v.every((s) => typeof s === 'string'),
};

const names = new Set<string>();
for (const t of base) {
  if (names.has(t.name)) errors.push(`${t.name}: defined more than once`);
  names.add(t.name);
}
const byName = new Map(base.map((t) => [t.name, t]));

for (const t of [...base, ...dark]) {
  if (isAlias(t.raw)) {
    const target = byName.get(aliasTarget(t.raw));
    if (!target) errors.push(`${t.name}: alias ${t.raw} does not resolve`);
    else if (target.type !== t.type) errors.push(`${t.name}: type ${t.type} but alias target is ${target.type}`);
  } else {
    const check = validators[t.type];
    if (!check) errors.push(`${t.name}: unsupported $type "${t.type}"`);
    else if (!check(t.raw)) errors.push(`${t.name}: invalid ${t.type} value ${JSON.stringify(t.raw)}`);
  }
}
for (const t of dark) if (!byName.has(t.name)) errors.push(`${t.name}: dark override has no base token`);

// Contrast (WCAG 2.x). Text pairs must reach 4.5:1 in both themes.
const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

if (!errors.length) {
  const { resolve } = makeResolver(base, dark);
  const pairs: [string, string][] = [
    ['color.text.primary', 'color.background.page'],
    ['color.text.primary', 'color.background.surface'],
    ['color.text.muted', 'color.background.page'],
    ['color.text.muted', 'color.background.surface'],
    ['color.text.link', 'color.background.page'],
    ['color.text.link', 'color.background.surface'],
    ['color.accent.on', 'color.accent.default'],
  ];
  for (const theme of ['light', 'dark'] as Theme[]) {
    for (const [fg, bg] of pairs) {
      const r = ratio(resolve(fg, theme) as string, resolve(bg, theme) as string);
      if (r < 4.5) errors.push(`${theme}: ${fg} on ${bg} is ${r.toFixed(2)}:1 (needs 4.5:1)`);
    }
  }
  // Site accents are decorative. Flag any that could not carry text on the page background.
  for (const t of base.filter((x) => x.name.startsWith('color.site.'))) {
    for (const theme of ['light', 'dark'] as Theme[]) {
      const r = ratio(resolve(t.name, theme) as string, resolve('color.background.page', theme) as string);
      if (r < 3) warnings.push(`${theme}: ${t.name} is ${r.toFixed(2)}:1 on the page background. Decorative use only.`);
    }
  }
}

warnings.forEach((w) => console.warn('warn  ' + w));
if (errors.length) {
  errors.forEach((e) => console.error('error ' + e));
  process.exit(1);
}
console.log(`Tokens OK (${base.length} tokens, ${dark.length} dark overrides).`);
