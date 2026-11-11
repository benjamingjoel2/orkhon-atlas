// Phone-width check: loads every page in the sitemap at 375px (iPhone SE-ish) and reports
// horizontal overflow, broken images, and axe-core WCAG A/AA violations.
// Usage: node scripts/mobile-check.mjs <baseUrl> [screenshotDir]
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// Playwright is preinstalled globally in CI/dev containers; fall back to a local install.
const { chromium } = (() => { try { return require('playwright'); } catch { return createRequire(process.env.PLAYWRIGHT_PATH || '/opt/node22/lib/node_modules/')('playwright'); } })();
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const base = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
const shotDir = process.argv[3];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const page = await ctx.newPage();

const idx = await (await fetch(`${base}/sitemap-0.xml`)).text();
const paths = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
let bad = 0;
for (const p of paths) {
  const res = await page.goto(base + p, { waitUntil: 'load' });
  const status = res?.status();
  await page.evaluate(async () => { for (const img of document.images) { img.loading = 'eager'; } window.scrollTo(0, document.body.scrollHeight); await new Promise((r) => setTimeout(r, 300)); window.scrollTo(0, 0); });
  await page.waitForLoadState('networkidle');
  const r = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    wide: [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1 && getComputedStyle(e).position !== 'absolute' && !e.closest('.site-nav ul, .prose table')).slice(0, 3).map((e) => e.tagName + '.' + e.className),
    brokenImgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
  }));
  await page.addScriptTag({ content: axeSource });
  const axe = await page.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa'] })).violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes[0]?.target}`));
  const ok = status === 200 && r.overflow <= 0 && !r.brokenImgs.length && !axe.length;
  if (!ok) bad++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${status} ${p}${r.overflow > 0 ? ` overflow=${r.overflow}px ${r.wide.join(',')}` : ''}${r.brokenImgs.length ? ` broken=${r.brokenImgs}` : ''}${axe.length ? ` axe=${axe.join(' | ')}` : ''}`);
  if (shotDir) await page.screenshot({ path: `${shotDir}/${p.replace(/\//g, '_') || 'home'}.png`, fullPage: false });
}
await browser.close();
console.log(`${paths.length} pages, ${bad} with problems`);
process.exit(bad ? 1 : 0);
