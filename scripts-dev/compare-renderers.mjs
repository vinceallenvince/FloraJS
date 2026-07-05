/**
 * Captures every demo page twice — DOMRenderer and CanvasRenderer
 * (?renderer=canvas) — and writes paired screenshots plus a
 * side-by-side gallery to renderer-comparison/.
 *
 * The sims are randomized, so pairs match in character (colors,
 * shapes, borders, motion), not pixel-for-pixel.
 *
 * Requires a server for public/ (npm run serve) and playwright
 * (npm i --no-save playwright && npx playwright install chromium).
 *
 * Usage: node scripts-dev/compare-renderers.mjs [baseUrl]
 */
import fs from 'node:fs';
import path from 'node:path';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('playwright is not installed. Run:\n  npm install --no-save playwright && npx playwright install chromium');
  process.exit(1);
}

const BASE = process.argv[2] || 'http://localhost:8321';
const OUT = 'renderer-comparison';

const pages = fs.readdirSync('public')
    .filter((f) => f.startsWith('Flora.') && f.endsWith('.html'))
    .sort();

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 600 } });

const rows = [];
for (const demo of pages) {
  const name = demo.replace(/\.html$/, '');
  const shots = {};
  for (const [variant, query] of [['dom', ''], ['canvas', '?renderer=canvas']]) {
    const file = `${name}.${variant}.png`;
    let status = 'ok';
    try {
      await page.goto(`${BASE}/${demo}${query}`, { waitUntil: 'load', timeout: 10000 });
      // Let the sim run so items spread out from their spawn points.
      await page.waitForTimeout(1500);
      const clock = await page.evaluate(() => window.Flora ? window.Flora.System.clock : -1);
      if (clock <= 0) status = 'FROZEN (setup error?)';
      await page.screenshot({ path: path.join(OUT, file) });
    } catch (e) {
      status = 'ERROR: ' + e.message.split('\n')[0];
    }
    shots[variant] = { file, status };
    console.log(`${name} [${variant}] ${status}`);
  }
  rows.push({ name, shots });
}

await browser.close();

const gallery = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>FloraJS renderer comparison</title>
<style>
  body { font-family: -apple-system, Helvetica, sans-serif; background: #222; color: #eee; margin: 2em; }
  h1 { font-size: 1.4em; } h2 { font-size: 1.1em; margin: 2em 0 0.5em; }
  .pair { display: flex; gap: 12px; }
  .pair figure { margin: 0; }
  .pair img { width: 480px; border: 1px solid #555; display: block; }
  figcaption { font-size: 0.85em; color: #aaa; padding: 4px 0; }
  .bad { color: #f66; }
  p.note { color: #aaa; max-width: 60em; }
</style></head><body>
<h1>FloraJS renderer comparison &mdash; DOM (left) vs Canvas (right)</h1>
<p class="note">Sims are randomized: pairs match in character (colors, shapes,
borders, glow, motion), not pixel-for-pixel. Known canvas limitations:
demos that hand-decorate item.el (Flora.Camera, Flora.Sim.FishFood)
require the DOMRenderer; box-shadow spread is approximated.</p>
${rows.map((r) => `<h2>${r.name}</h2>
<div class="pair">
  <figure><img src="${r.shots.dom.file}" loading="lazy"><figcaption>DOM &mdash; ${r.shots.dom.status === 'ok' ? 'ok' : `<span class="bad">${r.shots.dom.status}</span>`}</figcaption></figure>
  <figure><img src="${r.shots.canvas.file}" loading="lazy"><figcaption>Canvas &mdash; ${r.shots.canvas.status === 'ok' ? 'ok' : `<span class="bad">${r.shots.canvas.status}</span>`}</figcaption></figure>
</div>`).join('\n')}
</body></html>`;

fs.writeFileSync(path.join(OUT, 'index.html'), gallery);
console.log(`\nWrote ${rows.length} pairs to ${OUT}/ — open ${OUT}/index.html`);
