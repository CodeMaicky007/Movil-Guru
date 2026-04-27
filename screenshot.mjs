// Usage: node screenshot.mjs <url> <viewport> [label]
// viewport: 375 | 768 | 1024 | 1280 | 1920  (or WxH)
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const CHROME = 'C:/Users/acmig/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe';
const url = process.argv[2] || 'http://localhost:3000';
const vpArg = process.argv[3] || '1280';
const label = process.argv[4] || '';

function parseVp(v) {
  if (v.includes('x')) {
    const [w, h] = v.split('x').map(Number);
    return { width: w, height: h };
  }
  const w = Number(v);
  // Heights: keep large enough to capture above-the-fold + below
  const h = w >= 1024 ? 900 : w >= 768 ? 1024 : 812;
  return { width: w, height: h };
}

const outDir = path.resolve('./temporary screenshots');
fs.mkdirSync(outDir, { recursive: true });

function nextFile(name) {
  const existing = fs.readdirSync(outDir).filter(f => f.startsWith('screenshot-'));
  const nums = existing.map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1] ?? '0', 10));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return path.join(outDir, name ? `screenshot-${next}-${name}.png` : `screenshot-${next}.png`);
}

const vp = parseVp(vpArg);
const tag = label ? `${vpArg}-${label}` : `${vpArg}`;
const file = nextFile(tag);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--hide-scrollbars'],
  defaultViewport: { width: vp.width, height: vp.height, deviceScaleFactor: 1 },
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  // Give animations a moment to settle
  await new Promise(r => setTimeout(r, 1500));
  const fullArg = (process.argv[5] === 'full' || process.argv[5] === undefined);
  await page.screenshot({ path: file, fullPage: fullArg });
  console.log('Saved', file);
} finally {
  await browser.close();
}
