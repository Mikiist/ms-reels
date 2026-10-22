// Vorschau: node preview.mjs <spec.json> <ordner> <zeit1> <zeit2> ... (Bilder in 1/3 Größe)
import pw from "/opt/node22/lib/node_modules/playwright/index.js"; const { chromium } = pw;
import fs from "node:fs"; import path from "node:path";
const [specPath, outDir, ...times] = process.argv.slice(2);
const spec = JSON.parse(fs.readFileSync(specPath, "utf8")); fs.mkdirSync(outDir, { recursive: true });
const here = path.dirname(new URL(import.meta.url).pathname);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--allow-file-access-from-files"] });
const p = await (await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 / 3 })).newPage();
const errs = []; p.on("pageerror", (e) => errs.push(String(e))); p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
await p.addInitScript((s) => { window.SPEC = s; }, spec);
await p.goto("file://" + here + "/reel.html"); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
const ts = times.length ? times.map(Number) : [];
if (!ts.length) { const info = await p.evaluate(() => window.INFO()); for (const s of info.scenes) { const d = s.t1 - s.t0; ts.push(+(s.t0 + 0.12).toFixed(2), +(s.t0 + d * 0.5).toFixed(2), +(s.t1 - 0.05).toFixed(2)); } }
for (const t of ts) { await p.evaluate((t) => window.render(t), t); await p.screenshot({ path: `${outDir}/f_${String(Math.round(t * 100)).padStart(5, "0")}.jpg`, type: "jpeg", quality: 80 }); }
if (errs.length) console.log("FEHLER:", errs.slice(0, 5).join("\n"));
console.log(JSON.stringify(await p.evaluate(() => window.INFO()), null, 0).slice(0, 3000));
await b.close();
