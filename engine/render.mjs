// Rendert ein Reel: node render.mjs <ordner>   (liest <ordner>/spec.json)
// Schreibt events.json, info.json und video.mp4 (ohne Ton). 3 Browser-Seiten rendern parallel.
import pw from "/opt/node22/lib/node_modules/playwright/index.js"; const { chromium } = pw;
import fs from "node:fs"; import path from "node:path"; import { spawnSync } from "node:child_process";
const dir = path.resolve(process.argv[2]); const FPS = 30; const PAR = Number(process.env.PAR || 3);
const spec = JSON.parse(fs.readFileSync(dir + "/spec.json", "utf8"));
const here = path.dirname(new URL(import.meta.url).pathname);
const fr = dir + "/frames"; fs.rmSync(fr, { recursive: true, force: true }); fs.mkdirSync(fr, { recursive: true });
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--allow-file-access-from-files"] });
const errs = [];
async function page() {
  const p = await (await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })).newPage();
  p.on("pageerror", (e) => errs.push(String(e))); p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  await p.addInitScript((s) => { window.SPEC = s; }, spec);
  await p.goto("file://" + here + "/reel.html"); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400); return p;
}
const p0 = await page();
const info = await p0.evaluate(() => window.INFO()); info.id = spec.id;
fs.writeFileSync(dir + "/info.json", JSON.stringify(info, null, 1));
fs.writeFileSync(dir + "/events.json", JSON.stringify(await p0.evaluate(() => window.EVENTS())));
const n = Math.round(FPS * spec.dur); let done = 0; const t0 = Date.now();
const pages = [p0]; for (let i = 1; i < PAR; i++) pages.push(await page());
await Promise.all(pages.map(async (p, k) => {
  for (let i = k; i < n; i += PAR) {
    await p.evaluate((t) => window.render(t), i / FPS);
    await p.screenshot({ path: `${fr}/${String(i).padStart(5, "0")}.jpg`, type: "jpeg", quality: 92 });
    done++; if (done % 150 === 0) console.log(`Bild ${done}/${n}, ${Math.round((Date.now() - t0) / 1000)} s`);
  }
}));
await b.close();
if (errs.length) { console.error("FEHLER im Browser:\n" + errs.slice(0, 8).join("\n")); }
const r = spawnSync("ffmpeg", ["-y", "-v", "error", "-framerate", String(FPS), "-i", `${fr}/%05d.jpg`, "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-maxrate", "4500k", "-bufsize", "9000k",
  "-pix_fmt", "yuv420p", "-g", "60", "-movflags", "+faststart", dir + "/video.mp4"], { stdio: "inherit" });
if (r.status !== 0) process.exit(1);
fs.rmSync(fr, { recursive: true, force: true });
console.log(`video.mp4 fertig: ${n} Bilder in ${Math.round((Date.now() - t0) / 1000)} s`);
if (errs.length) process.exit(2);
