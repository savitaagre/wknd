// dynamics Phase 1 search probe: type one term into the SOURCE search page, record what it shows
// (visible result count, top titles ≤ 3, one known hit) plus the network calls the search made.
// Usage: node stardust/scripts/_probes/search-probe.mjs <url> <term> <out.json>
import fs from 'fs';
import { chromium } from 'playwright';

const [url, term, out] = process.argv.slice(2);
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36';
const browser = await chromium.launch();
const page = await (await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } })).newPage();
const calls = [];
page.on('response', (r) => {
  const u = r.url();
  if (/search|contentai|\.json/i.test(u) && !/\.(css|js|png|jpe?g|svg|woff2?)(\?|$)/.test(u)) calls.push({ url: u, status: r.status() });
});
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2500);
const input = page.locator('.cmp-contentaisearch__input').first();
await input.fill(term);
await input.press('Enter');
await page.waitForTimeout(6000);
const result = await page.evaluate(() => {
  const vis = (el) => !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  const root = document.querySelector('.cmp-contentaisearch');
  const items = [...(root?.querySelectorAll('a[href]') || [])].filter(vis)
    .map((a) => ({ title: a.textContent.trim().replace(/\s+/g, ' '), href: a.getAttribute('href') }))
    .filter((x) => x.title);
  const status = [...(root?.querySelectorAll('[class*="count"],[class*="status"],[class*="message"],[class*="empty"]') || [])]
    .filter(vis).map((e) => e.textContent.trim()).filter(Boolean);
  return { count: items.length, titles: items.slice(0, 3).map((x) => x.title), items: items.slice(0, 20), status };
});
fs.writeFileSync(out, JSON.stringify({ url, term, probedAt: new Date().toISOString(), ...result, calls }, null, 2));
console.log(`search-probe "${term}": ${result.count} visible results; top: ${result.titles.join(' | ')}; status: ${result.status.join(' | ')}; calls: ${calls.length}`);
await browser.close();
