import fs from 'node:fs';
import path from 'node:path';
import { cssVar, distDir, isAlias, aliasTarget, loadAll, makeResolver, toDtcg } from './lib/tokens';

const errors: string[] = [];
const { base, dark } = loadAll(errors);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
const { resolve, darkMap } = makeResolver(base, dark);
const darkNames = new Set(dark.map((t) => t.name));

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, 'tokens.json'), JSON.stringify(toDtcg(base), null, 2) + '\n');
fs.writeFileSync(path.join(distDir, 'tokens.dark.json'), JSON.stringify(toDtcg(dark), null, 2) + '\n');

// Flat, fully resolved list used by the docs site (TokenTable).
const rows = base.map((t) => {
  const row: Record<string, unknown> = {
    name: t.name,
    cssVar: cssVar(t.name),
    type: t.type,
    layer: t.layer,
    value: resolve(t.name, 'light'),
  };
  if (isAlias(t.raw)) row.alias = aliasTarget(t.raw);
  const darkValue = resolve(t.name, 'dark');
  if (darkNames.has(t.name) || darkValue !== row.value) row.dark = darkValue;
  return row;
});
fs.writeFileSync(path.join(distDir, '..', 'data', 'tokens.resolved.json'), JSON.stringify({ tokens: rows }, null, 2) + '\n');
void darkMap;
console.log(`tokens.json, tokens.dark.json, tokens.resolved.json written (${rows.length} tokens).`);
