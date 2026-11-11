// Post-build checks for Orkhon Atlas. Run after `npm run build`:  node scripts/check-site.mjs
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const problems = [];
const fail = (m) => problems.push(m);

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const files = walk(DIST);
const html = files.filter((f) => f.endsWith('.html'));

// 1. JSON-LD on every page
for (const f of html) {
  const s = readFileSync(f, 'utf8');
  const m = s.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
  if (!m) { fail(`${f}: no JSON-LD`); continue; }
  const types = JSON.parse(m[1])['@graph'].map((n) => n['@type']);
  for (const t of ['Organization', 'WebSite']) if (!types.includes(t)) fail(`${f}: JSON-LD missing ${t}`);
  const isHome = f === join(DIST, 'index.html');
  if (!isHome && !f.endsWith('404.html') && !types.includes('BreadcrumbList')) fail(`${f}: JSON-LD missing BreadcrumbList`);
  if (f.includes(`${DIST}/posts/`) && !f.endsWith(`posts/index.html`) && !types.includes('BlogPosting')) fail(`${f}: JSON-LD missing BlogPosting`);
  if (!/Published by Tourground/.test(s)) fail(`${f}: footer missing "Published by Tourground"`);
  if (!/<html lang="en-GB">/.test(s)) fail(`${f}: missing lang`);
  if ((s.match(/<h1[\s>]/g) || []).length !== 1) fail(`${f}: expected exactly one h1`);
  for (const img of s.match(/<img [^>]*>/g) || []) if (!/ alt[ =>]/.test(img)) fail(`${f}: img without alt`);
}

// 2. Internal links resolve
const exists = (url) => {
  const clean = decodeURI(url.split('#')[0].split('?')[0]);
  if (clean === '') return true;
  const p = join(DIST, clean);
  return existsSync(p) && (statSync(p).isFile() || existsSync(join(p, 'index.html')));
};
for (const f of html) {
  const s = readFileSync(f, 'utf8');
  for (const [, href] of s.matchAll(/(?:href|src)="(\/[^"]*)"/g)) if (!exists(href)) fail(`${f}: broken link ${href}`);
}

// 3. Required pages
for (const p of ['about', 'authors', 'disclosure', 'privacy', 'cookies', 'terms', 'photo-credits'])
  if (!existsSync(join(DIST, p, 'index.html'))) fail(`missing /${p}/`);
for (const p of ['llms.txt', 'rss.xml', 'sitemap-index.xml', 'robots.txt']) if (!existsSync(join(DIST, p))) fail(`missing /${p}`);
if (!/Published by Tourground/.test(readFileSync(join(DIST, 'about/index.html'), 'utf8'))) fail('/about/ must say Published by Tourground');

// 4. Post content rules
const postsDir = 'src/content/posts';
for (const f of readdirSync(postsDir)) {
  const raw = readFileSync(join(postsDir, f), 'utf8');
  const body = raw.replace(/^---[\s\S]*?---/, '');
  const words = body.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').split(/\s+/).filter(Boolean).length;
  if (words < 1200 || words > 2000) fail(`${f}: ${words} words (want 1,200-2,000)`);
  if (/[$£€¥₮]\s?\d|\d\s?(USD|MNT|GBP|EUR|tugriks?)\b/i.test(body)) fail(`${f}: looks like a price`);
  if (!/^sources:/m.test(raw)) fail(`${f}: no sources`);
  if (!/^updated:/m.test(raw)) fail(`${f}: no updated date`);
}

// 5. Colour contrast of the text pairs we use
const lum = (hex) => {
  const c = hex.match(/\w\w/g).map((x) => parseInt(x, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const pairs = [
  ['#1c2430', '#fbf8f1', 'ink on paper'], ['#4f5763', '#fbf8f1', 'muted on paper'], ['#1a5e96', '#fbf8f1', 'link on paper'],
  ['#6f5110', '#fbf8f1', 'gold label on paper'], ['#4f5763', '#f5ead0', 'muted on gold box'], ['#1a5e96', '#f5ead0', 'link on gold box'],
  ['#1a5e96', '#e4eef7', 'link on sky box'], ['#4f5763', '#e4eef7', 'muted on sky box'], ['#6f5110', '#e4eef7', 'gold label on sky box'],
  ['#ffffff', '#1a5e96', 'button text'], ['#eef3f8', '#123f66', 'footer text'], ['#ffffff', '#1c2430', 'ad label'],
];
for (const [fg, bg, name] of pairs) { const r = ratio(fg, bg); if (r < 4.5) fail(`contrast ${name}: ${r.toFixed(2)}`); }

console.log(`Checked ${html.length} pages.`);
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log('All checks passed.');
